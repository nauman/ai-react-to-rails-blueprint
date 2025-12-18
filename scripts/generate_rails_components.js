#!/usr/bin/env node

/**
 * Rails Component Generator (tool-agnostic)
 *
 * Converts React/Next TypeScript components into Rails shadow artifacts:
 * - ViewComponent classes with ERB templates (custom components)
 * - BEM-structured CSS files (ITCSS components layer)
 * - Stimulus controllers
 * - ActiveRecord models inferred from TS interfaces
 * - Optional doc entries to keep React↔Rails mappings in sync
 *
 * Architecture:
 * - ViewComponent + ERB for custom application components
 * - RubyUI (Phlex) for pre-built UI primitives (used within ViewComponents)
 * - ITCSS + BEM + Tailwind for CSS architecture
 *
 * Usage:
 *   node scripts/generate_rails_components.js --all
 *   node scripts/generate_rails_components.js --component=FilterChip
 *   node scripts/generate_rails_components.js --models-only
 *   node scripts/generate_rails_components.js --dry-run
 *   node scripts/generate_rails_components.js --update-docs --component=FilterChip
 */

const fs = require('fs').promises;
const path = require('path');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const ROOT = path.join(__dirname, '..');

const CONFIG = {
  paths: {
    components: path.join(ROOT, 'src/components/app'),
    types: path.join(ROOT, 'src/types/index.ts'),
    templates: path.join(__dirname, 'templates'),
    output: {
      base: path.join(ROOT, 'rails_generated'),
      components: path.join(ROOT, 'rails_generated/app/components'),
      stylesheets: path.join(ROOT, 'rails_generated/app/assets/stylesheets'),
      stimulus: path.join(ROOT, 'rails_generated/app/javascript/controllers'),
      models: path.join(ROOT, 'rails_generated/app/models')
    },
    docs: path.join(ROOT, 'docs'),
    mappingLog: path.join(ROOT, 'docs/react_to_rails.md')
  },
  templates: {
    viewComponent: 'view_component.rb.template',
    viewComponentErb: 'view_component.html.erb.template',
    viewComponentCss: 'view_component.css.template',
    stimulus: 'stimulus_controller.js.template',
    model: 'model.rb.template'
  }
};

const FALLBACK_TEMPLATES = {
  viewComponent: `# frozen_string_literal: true
# Source: {{react_file_path}}

class {{component_name}}Component < ApplicationComponent
  {{prop_attrs}}

  def initialize({{props}})
    {{prop_assignments}}
  end

  # BEM helper for this component
  def block_class
    "{{bem_block}}"
  end

  # Suggested RubyUI components to consider:
  # - RubyUI::Button for actions
  # - RubyUI::Card for containers
  # - RubyUI::Badge for tags/status
  # - RubyUI::Avatar for user images
  # - RubyUI::Input, RubyUI::Select for form controls
  #
  # Example usage in ERB template:
  # <%= render RubyUI::Button.new(variant: :primary) { "Click me" } %>
end
`,
  viewComponentErb: `<%# Source: {{react_file_path}} %>
<%# BEM Block: {{bem_block}} %>

<div class="{{bem_block}}" data-controller="{{stimulus_controller}}">
  <%#
    TODO: Convert React JSX to ERB

    RubyUI components available:
    - <%= render RubyUI::Button.new(variant: :primary) { "Action" } %>
    - <%= render RubyUI::Card.new { ... } %>
    - <%= render RubyUI::Badge.new { "Status" } %>
    - <%= render RubyUI::Avatar.new(src: url, alt: name) %>

    Use BEM naming for custom elements:
    - {{bem_block}}__header
    - {{bem_block}}__content
    - {{bem_block}}__footer
    - {{bem_block}}--modifier
  %>

  {{html_structure}}
</div>
`,
  viewComponentCss: `/* Source: {{react_file_path}} */
/* ITCSS Layer: components */
/* BEM Block: {{bem_block}} */

.{{bem_block}} {
  /* Block base styles */
  /* Use Tailwind for spacing/colors, BEM for structure */
}

/* Elements */
.{{bem_block}}__header {
}

.{{bem_block}}__content {
}

.{{bem_block}}__footer {
}

/* Modifiers */
.{{bem_block}}--active {
}

.{{bem_block}}--disabled {
}
`,
  stimulus: `// {{react_file_path}}
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { {{stimulus_values}} }
  static targets = [{{stimulus_targets}}]

  connect() {
    {{initialization_code}}
  }

  {{action_methods}}

  disconnect() {
    {{cleanup_code}}
  }
}
`,
  model: `# {{interface_path}}
class {{model_name}} < ApplicationRecord
  {{associations}}

  {{validations}}

  {{scopes}}

  {{instance_methods}}
end
`
};

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function loadTemplate(name, fallbackKey) {
  const filePath = path.join(CONFIG.paths.templates, name);
  if (await pathExists(filePath)) {
    return fs.readFile(filePath, 'utf-8');
  }
  return FALLBACK_TEMPLATES[fallbackKey];
}

function sanitizeLines(block) {
  return block
    .split('\n')
    .map(line => line.replace(/\/\/.*$/, '').replace(/\/\*.*\*\//g, '').trim())
    .filter(Boolean);
}

function isBuiltInHook(name) {
  const builtIns = new Set([
    'useState',
    'useEffect',
    'useRef',
    'useContext',
    'useReducer',
    'useMemo',
    'useCallback',
    'useLayoutEffect',
    'useImperativeHandle',
    'useTransition',
    'useDeferredValue',
    'useId'
  ]);
  return builtIns.has(name);
}

function toSnakeCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().replace(/^_/, '');
}

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// -----------------------------------------------------------------------------
// Component Analyzer
// -----------------------------------------------------------------------------

class ComponentAnalyzer {
  constructor(filePath) {
    this.filePath = filePath;
    this.content = '';
    this.analysis = {
      name: '',
      props: [],
      state: [],
      effects: [],
      handlers: [],
      hooks: [],
      childComponents: [],
      icons: [],
      tailwindClasses: [],
      exports: { type: 'default', name: '' }
    };
  }

  async analyze() {
    this.content = await fs.readFile(this.filePath, 'utf-8');
    this.extractComponentName();
    this.extractProps();
    this.extractState();
    this.extractHandlers();
    this.extractHooks();
    this.extractIcons();
    this.extractTailwindClasses();
    this.extractChildComponents();
    return this.analysis;
  }

  extractComponentName() {
    const exportMatch = this.content.match(/export\s+(default\s+)?(?:function|const|class)\s+(\w+)/);
    if (exportMatch) {
      this.analysis.name = exportMatch[2];
      this.analysis.exports.type = exportMatch[1] ? 'default' : 'named';
      this.analysis.exports.name = exportMatch[2];
      return;
    }
    const namedExportMatch = this.content.match(/export\s*{\s*(\w+)\s*as\s*default/);
    if (namedExportMatch) {
      this.analysis.name = namedExportMatch[1];
      this.analysis.exports.type = 'default';
      this.analysis.exports.name = namedExportMatch[1];
    }
  }

  extractProps() {
    const interfaceRegex = /(interface|type)\s+(\w+Props)\s*=?\s*{([^}]+)}/gs;
    const matches = [...this.content.matchAll(interfaceRegex)];
    if (matches.length === 0) return;

    const lastMatch = matches[matches.length - 1];
    const propsBody = lastMatch[3];
    const lines = sanitizeLines(propsBody.replace(/},?$/, '').replace(/{/g, ''));

    this.analysis.props = lines
      .map(line => {
        const clean = line.replace(/[,;]\s*$/, '');
        const match = clean.match(/(\w+)(\?)?:\s*(.+)/);
        if (!match) return null;
        return {
          name: match[1],
          optional: Boolean(match[2]),
          type: match[3].trim()
        };
      })
      .filter(Boolean);
  }

  extractState() {
    const stateRegex = /const\s+\[([^\]]+)\]\s*=\s*useState(?:<([^>]+)>)?\(([^)]*)\)/g;
    let match;
    while ((match = stateRegex.exec(this.content)) !== null) {
      const varName = match[1].split(',')[0].trim();
      this.analysis.state.push({
        name: varName,
        type: (match[2] || 'unknown').trim(),
        initialValue: match[3].trim()
      });
    }
  }

  extractHandlers() {
    const handlerRegex = /const\s+(\w*[Hh]andle\w+)\s*=\s*(?:\([^)]*\)\s*=>\s*{|function\s*\([^)]*\)\s*{)/g;
    let match;
    while ((match = handlerRegex.exec(this.content)) !== null) {
      this.analysis.handlers.push({
        name: match[1],
        type: this.inferHandlerType(match[1])
      });
    }
  }

  inferHandlerType(handlerName) {
    const lower = handlerName.toLowerCase();
    if (lower.includes('click')) return 'click';
    if (lower.includes('change')) return 'change';
    if (lower.includes('submit')) return 'submit';
    if (lower.includes('touch')) return 'touch';
    if (lower.includes('drag')) return 'drag';
    if (lower.includes('focus')) return 'focus';
    if (lower.includes('blur')) return 'blur';
    return 'custom';
  }

  extractHooks() {
    const hookRegex = /use([A-Z]\w+)\(/g;
    let match;
    while ((match = hookRegex.exec(this.content)) !== null) {
      const hookName = `use${match[1]}`;
      if (!isBuiltInHook(hookName)) {
        this.analysis.hooks.push(hookName);
      }
    }
  }

  extractIcons() {
    const iconImportMatch = this.content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
    if (iconImportMatch) {
      this.analysis.icons = iconImportMatch[1].split(',').map(i => i.trim());
    }
  }

  extractTailwindClasses() {
    const classRegex = /className=["']([^"']+)["']/g;
    let match;
    const classSet = new Set();
    while ((match = classRegex.exec(this.content)) !== null) {
      match[1].split(/\s+/).forEach(cls => {
        if (cls.trim()) classSet.add(cls.trim());
      });
    }
    this.analysis.tailwindClasses = Array.from(classSet);
  }

  extractChildComponents() {
    const componentRegex = /<([A-Z][\w]*)\b/g;
    let match;
    const componentSet = new Set();
    while ((match = componentRegex.exec(this.content)) !== null) {
      componentSet.add(match[1]);
    }
    this.analysis.childComponents = Array.from(componentSet);
  }
}

// -----------------------------------------------------------------------------
// ViewComponent Generator
// -----------------------------------------------------------------------------

class ViewComponentGenerator {
  constructor(analysis, rbTemplate, erbTemplate, cssTemplate) {
    this.analysis = analysis;
    this.rbTemplate = rbTemplate;
    this.erbTemplate = erbTemplate;
    this.cssTemplate = cssTemplate;
  }

  async generate() {
    const bemBlock = toKebabCase(this.analysis.name);
    const stimulusController = toKebabCase(this.analysis.name);

    return {
      rb: this.generateRb(bemBlock),
      erb: this.generateErb(bemBlock, stimulusController),
      css: this.generateCss(bemBlock)
    };
  }

  generateRb(bemBlock) {
    return this.rbTemplate
      .replace(/{{component_name}}/g, this.analysis.name)
      .replace(/{{props}}/g, this.generatePropsSignature())
      .replace(/{{prop_attrs}}/g, this.generatePropAttrs())
      .replace(/{{prop_assignments}}/g, this.generatePropAssignments())
      .replace(/{{bem_block}}/g, bemBlock)
      .replace(/{{react_file_path}}/g, this.analysis.filePath || 'unknown')
      .replace(/{{timestamp}}/g, new Date().toISOString());
  }

  generateErb(bemBlock, stimulusController) {
    return this.erbTemplate
      .replace(/{{bem_block}}/g, bemBlock)
      .replace(/{{stimulus_controller}}/g, stimulusController)
      .replace(/{{html_structure}}/g, this.generateHtmlStructure())
      .replace(/{{react_file_path}}/g, this.analysis.filePath || 'unknown')
      .replace(/{{timestamp}}/g, new Date().toISOString());
  }

  generateCss(bemBlock) {
    return this.cssTemplate
      .replace(/{{bem_block}}/g, bemBlock)
      .replace(/{{react_file_path}}/g, this.analysis.filePath || 'unknown')
      .replace(/{{timestamp}}/g, new Date().toISOString());
  }

  generatePropAttrs() {
    if (!this.analysis.props.length) return '# No props';
    return this.analysis.props
      .map(p => `attr_reader :${p.name}`)
      .join('\n  ');
  }

  generatePropsSignature() {
    if (!this.analysis.props.length) return '';
    return this.analysis.props
      .map(p => `${p.name}${p.optional ? ': nil' : ':'}`)
      .join(', ');
  }

  generatePropAssignments() {
    if (!this.analysis.props.length) return '# no props detected';
    return this.analysis.props.map(p => `@${p.name} = ${p.name}`).join('\n    ');
  }

  generateHtmlStructure() {
    // Generate ERB-friendly structure hints
    const childHints = this.analysis.childComponents
      .map(c => `<%# Child: ${c} %>`)
      .join('\n  ');
    return childHints || '<%# Add component content here %>';
  }
}

// -----------------------------------------------------------------------------
// Stimulus Generator
// -----------------------------------------------------------------------------

class StimulusGenerator {
  constructor(analysis, template) {
    this.analysis = analysis;
    this.template = template;
  }

  async generate() {
    return this.template
      .replace(/{{component_name}}/g, toKebabCase(this.analysis.name))
      .replace(/{{stimulus_values}}/g, this.generateValues())
      .replace(/{{stimulus_targets}}/g, this.generateTargets())
      .replace(/{{initialization_code}}/g, this.generateInitCode())
      .replace(/{{cleanup_code}}/g, this.generateCleanupCode())
      .replace(/{{action_methods}}/g, this.generateActionMethods())
      .replace(/{{react_file_path}}/g, this.analysis.filePath || 'unknown')
      .replace(/{{timestamp}}/g, new Date().toISOString());
  }

  generateValues() {
    if (!this.analysis.state.length) return '';
    return this.analysis.state
      .map(s => `${s.name}: ${this.tsToJsType(s.type)}`)
      .join(', ');
  }

  generateTargets() {
    const targets = ['"element"'];
    if (this.analysis.childComponents.length > 0) {
      targets.push('"content"');
    }
    return targets.length ? targets.join(', ') : '';
  }

  generateInitCode() {
    return `// Initialize controller\n    console.log('${this.analysis.name} controller connected')`;
  }

  generateCleanupCode() {
    return `// Cleanup resources\n    console.log('${this.analysis.name} controller disconnected')`;
  }

  generateActionMethods() {
    if (!this.analysis.handlers.length) {
      return '// Add event handlers here';
    }
    return this.analysis.handlers
      .map(
        h => `${h.name}(event) {
    console.log('${h.name} called', event);
  }`
      )
      .join('\n\n  ');
  }

  tsToJsType(tsType = '') {
    const type = tsType.toLowerCase();
    if (type.includes('number')) return 'Number';
    if (type.includes('boolean')) return 'Boolean';
    if (type.includes('string')) return 'String';
    if (type.includes('array') || type.includes('[]')) return 'Array';
    if (type.includes('record') || type.includes('object')) return 'Object';
    return 'String';
  }
}

// -----------------------------------------------------------------------------
// Model Generator
// -----------------------------------------------------------------------------

class ModelGenerator {
  constructor(typesContent, template) {
    this.typesContent = typesContent;
    this.template = template;
    this.models = [];
  }

  async parse() {
    const interfaceRegex = /export\s+(interface|type)\s+(\w+)\s*=?\s*{([^}]+)}/gs;
    let match;
    while ((match = interfaceRegex.exec(this.typesContent)) !== null) {
      const modelName = match[2];
      const fields = this.parseFields(match[3]);
      this.models.push({
        name: modelName,
        fields,
        associations: this.inferAssociations(fields),
        validations: this.inferValidations(fields)
      });
    }
    return this.models;
  }

  parseFields(fieldsStr) {
    return sanitizeLines(fieldsStr)
      .map(line => line.replace(/[,;]\s*$/, ''))
      .map(line => {
        const match = line.match(/(\w+)(\?)?:\s*(.+)/);
        if (!match) return null;
        return {
          name: match[1],
          optional: Boolean(match[2]),
          type: match[3].trim()
        };
      })
      .filter(Boolean);
  }

  inferAssociations(fields) {
    const associations = [];
    fields.forEach(field => {
      if (this.isForeignKey(field)) {
        const base = field.name.replace(/(_id|Id)$/i, '');
        associations.push({ type: 'belongs_to', name: base });
      } else if (this.isCollection(field.type)) {
        const singular = field.name.replace(/s$/, '') || field.name;
        associations.push({ type: 'has_many', name: field.name, className: this.capitalize(singular) });
      }
    });
    return associations;
  }

  inferValidations(fields) {
    const validations = [];
    fields.forEach(field => {
      if (!field.optional) {
        validations.push({ type: 'presence', field: field.name });
      }
      if (/email/i.test(field.name)) {
        validations.push({ type: 'email', field: field.name });
      }
      if (/url/i.test(field.name)) {
        validations.push({ type: 'url', field: field.name });
      }
    });
    return validations;
  }

  isForeignKey(field) {
    if (!/(_id|Id)$/i.test(field.name)) return false;
    const t = field.type.toLowerCase();
    return t.includes('string') || t.includes('number') || t.includes('uuid');
  }

  isCollection(typeStr) {
    return /\[\]$/.test(typeStr.trim()) || /^array<.+>$/i.test(typeStr.trim());
  }

  async generateModel(model) {
    return this.template
      .replace(/{{model_name}}/g, model.name)
      .replace(/{{associations}}/g, this.formatAssociations(model.associations))
      .replace(/{{validations}}/g, this.formatValidations(model.validations))
      .replace(/{{scopes}}/g, this.generateScopes(model))
      .replace(/{{instance_methods}}/g, this.generateInstanceMethods(model))
      .replace(/{{interface_path}}/g, 'src/types/index.ts')
      .replace(/{{timestamp}}/g, new Date().toISOString());
  }

  formatAssociations(associations) {
    if (!associations.length) return '# associations: none inferred';
    return associations
      .map(a => {
        if (a.type === 'belongs_to') {
          return `belongs_to :${a.name}`;
        }
        if (a.type === 'has_many') {
          return `has_many :${a.name}${a.className ? `, class_name: '${a.className}'` : ''}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n  ');
  }

  formatValidations(validations) {
    if (!validations.length) return '# validations: none inferred';
    return validations
      .map(v => {
        if (v.type === 'presence') return `validates :${v.field}, presence: true`;
        if (v.type === 'email') return `validates :${v.field}, format: { with: URI::MailTo::EMAIL_REGEXP }`;
        if (v.type === 'url') return `validates :${v.field}, format: { with: URI::DEFAULT_PARSER.make_regexp }`;
        return '';
      })
      .filter(Boolean)
      .join('\n  ');
  }

  generateScopes(model) {
    return `scope :recent, -> { order(created_at: :desc) }`;
  }

  generateInstanceMethods(model) {
    return '# add instance methods as needed';
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// -----------------------------------------------------------------------------
// CLI
// -----------------------------------------------------------------------------

class CLI {
  constructor(args) {
    this.args = args;
    this.options = this.parseArgs(args);
  }

  parseArgs(args) {
    const options = {
      all: false,
      component: null,
      modelsOnly: false,
      dryRun: false,
      updateDocs: false,
      help: false
    };

    args.forEach(arg => {
      if (arg === '--all') options.all = true;
      else if (arg === '--models-only') options.modelsOnly = true;
      else if (arg === '--dry-run') options.dryRun = true;
      else if (arg === '--update-docs') options.updateDocs = true;
      else if (arg === '--help' || arg === '-h') options.help = true;
      else if (arg.startsWith('--component=')) {
        options.component = arg.split('=')[1];
      }
    });

    return options;
  }

  async run() {
    if (this.options.help) {
      this.showHelp();
      return;
    }

    console.log('🚀 Rails Component Generator\n');

    await this.assertPrereqs();

    if (this.options.modelsOnly) {
      await this.generateModels();
    } else if (this.options.component) {
      await this.generateComponent(this.options.component);
    } else if (this.options.all) {
      await this.generateAll();
    } else {
      console.log('❌ Please specify --all, --component=Name, or --models-only\n');
      this.showHelp();
    }
  }

  async assertPrereqs() {
    const templatesDirExists = await pathExists(CONFIG.paths.templates);
    if (!templatesDirExists) {
      console.log('ℹ️  Template directory not found; using built-in fallbacks.');
    }
    if (!(await pathExists(CONFIG.paths.docs))) {
      await ensureDir(CONFIG.paths.docs);
    }
  }

  async generateComponent(componentName) {
    console.log(`📦 Generating Rails equivalent for ${componentName}...\n`);

    const componentPath = path.join(CONFIG.paths.components, `${componentName}.tsx`);
    if (!(await pathExists(componentPath))) {
      throw new Error(`Component not found at ${componentPath}`);
    }

    const analyzer = new ComponentAnalyzer(componentPath);
    const analysis = await analyzer.analyze();
    analysis.filePath = path.relative(ROOT, componentPath);

    console.log(`✓ Analyzed ${componentName}`);
    console.log(`  - Props: ${analysis.props.length}`);
    console.log(`  - State: ${analysis.state.length}`);
    console.log(`  - Handlers: ${analysis.handlers.length}`);
    console.log(`  - Custom hooks: ${analysis.hooks.length}\n`);

    // Load ViewComponent templates
    const rbTemplate = await loadTemplate(CONFIG.templates.viewComponent, 'viewComponent');
    const erbTemplate = await loadTemplate(CONFIG.templates.viewComponentErb, 'viewComponentErb');
    const cssTemplate = await loadTemplate(CONFIG.templates.viewComponentCss, 'viewComponentCss');

    // Generate ViewComponent files
    const vcGen = new ViewComponentGenerator(analysis, rbTemplate, erbTemplate, cssTemplate);
    const componentFiles = await vcGen.generate();

    // Generate Stimulus controller
    const stimulusTemplate = await loadTemplate(CONFIG.templates.stimulus, 'stimulus');
    const stimulusGen = new StimulusGenerator(analysis, stimulusTemplate);
    const stimulusCode = await stimulusGen.generate();

    if (this.options.dryRun) {
      this.printDryRun(componentFiles, stimulusCode);
    } else {
      await this.saveComponentOutput(componentName, componentFiles, stimulusCode);
      if (this.options.updateDocs) {
        await this.appendMappingDoc(analysis);
      }
    }

    console.log('\n✅ Generation complete!');
  }

  async generateModels() {
    console.log('📦 Generating models from TypeScript interfaces...\n');

    if (!(await pathExists(CONFIG.paths.types))) {
      throw new Error(`Type definitions not found at ${CONFIG.paths.types}`);
    }

    const typesContent = await fs.readFile(CONFIG.paths.types, 'utf-8');
    const modelTemplate = await loadTemplate(CONFIG.templates.model, 'model');
    const modelGen = new ModelGenerator(typesContent, modelTemplate);

    const models = await modelGen.parse();
    console.log(`✓ Found ${models.length} models\n`);

    for (const model of models) {
      const modelCode = await modelGen.generateModel(model);

      if (this.options.dryRun) {
        console.log(`=== ${model.name} Model ===`);
        console.log(modelCode);
        console.log('');
      } else {
        const outputPath = path.join(CONFIG.paths.output.models, `${toSnakeCase(model.name)}.rb`);
        await ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, modelCode);
        console.log(`✓ Generated ${model.name} model`);
      }
    }

    console.log('\n✅ Model generation complete!');
  }

  async generateAll() {
    console.log('📦 Generating all components...\n');

    if (!(await pathExists(CONFIG.paths.components))) {
      throw new Error(`Components directory not found at ${CONFIG.paths.components}`);
    }

    const files = await fs.readdir(CONFIG.paths.components);
    const tsxFiles = files.filter(f => f.endsWith('.tsx'));
    console.log(`Found ${tsxFiles.length} components\n`);

    for (const file of tsxFiles) {
      const componentName = file.replace('.tsx', '');
      await this.generateComponent(componentName);
      console.log('---\n');
    }

    console.log('✅ All components generated!');
  }

  async saveComponentOutput(componentName, componentFiles, stimulusCode) {
    const snakeName = toSnakeCase(componentName);
    const kebabName = toKebabCase(componentName);

    // ViewComponent files (sidecar pattern)
    const componentDir = path.join(CONFIG.paths.output.components, snakeName);
    const rbPath = path.join(componentDir, `${snakeName}_component.rb`);
    const erbPath = path.join(componentDir, `${snakeName}_component.html.erb`);

    // ITCSS-structured CSS (components layer)
    const cssPath = path.join(CONFIG.paths.output.stylesheets, 'components', `_${kebabName}.css`);

    // Stimulus controller
    const stimulusPath = path.join(CONFIG.paths.output.stimulus, `${kebabName}_controller.js`);

    // Ensure directories exist
    await ensureDir(componentDir);
    await ensureDir(path.dirname(cssPath));
    await ensureDir(path.dirname(stimulusPath));

    // Write files
    await fs.writeFile(rbPath, componentFiles.rb);
    await fs.writeFile(erbPath, componentFiles.erb);
    await fs.writeFile(cssPath, componentFiles.css);
    await fs.writeFile(stimulusPath, stimulusCode);

    console.log(`✓ Saved ViewComponent: ${rbPath}`);
    console.log(`✓ Saved ERB template: ${erbPath}`);
    console.log(`✓ Saved BEM styles: ${cssPath}`);
    console.log(`✓ Saved Stimulus controller: ${stimulusPath}`);
  }

  async appendMappingDoc(analysis) {
    const snakeName = toSnakeCase(analysis.name);
    const kebabName = toKebabCase(analysis.name);

    const lines = [
      `## ${analysis.name}`,
      `- **React component:** \`${analysis.name}\``,
      `  - Props: ${analysis.props.map(p => p.name).join(', ') || 'n/a'}`,
      `  - State: ${analysis.state.map(s => s.name).join(', ') || 'n/a'}`,
      `  - Hooks: ${analysis.hooks.join(', ') || 'n/a'}`,
      `  - Icons: ${analysis.icons.join(', ') || 'n/a'}`,
      `- **ViewComponent:** \`app/components/${snakeName}/${snakeName}_component.rb\``,
      `- **ERB Template:** \`app/components/${snakeName}/${snakeName}_component.html.erb\``,
      `- **BEM Styles:** \`app/assets/stylesheets/components/_${kebabName}.css\``,
      `- **Stimulus:** \`app/javascript/controllers/${kebabName}_controller.js\``,
      `- **RubyUI usage:** [Document which RubyUI components to use]`,
      ''
    ].join('\n');

    await ensureDir(path.dirname(CONFIG.paths.mappingLog));
    await fs.appendFile(CONFIG.paths.mappingLog, `${lines}\n`);
    console.log(`✓ Updated mapping log: ${CONFIG.paths.mappingLog}`);
  }

  printDryRun(componentFiles, stimulusCode) {
    console.log('=== ViewComponent (Ruby) ===');
    console.log(componentFiles.rb);
    console.log('\n=== ViewComponent (ERB Template) ===');
    console.log(componentFiles.erb);
    console.log('\n=== BEM Styles (CSS) ===');
    console.log(componentFiles.css);
    console.log('\n=== Stimulus Controller ===');
    console.log(stimulusCode);
  }

  showHelp() {
    console.log(`
Rails Component Generator (ViewComponent + ITCSS/BEM)

Generates Rails shadow artifacts from React/TypeScript components:
- ViewComponent classes with ERB templates
- BEM-structured CSS files (ITCSS components layer)
- Stimulus controllers
- ActiveRecord models (from TypeScript interfaces)

Usage:
  node scripts/generate_rails_components.js [options]

Options:
  --all                Generate all components
  --component=Name     Generate a specific component
  --models-only        Generate only models from TypeScript interfaces
  --dry-run            Preview output without writing files
  --update-docs        Append mapping info to docs/react_to_rails.md
  --help, -h           Show this help message

Output Structure:
  rails_generated/
    app/
      components/          # ViewComponent (sidecar pattern)
        <name>/
          <name>_component.rb
          <name>_component.html.erb
      assets/
        stylesheets/
          components/      # ITCSS components layer (BEM)
            _<name>.css
      javascript/
        controllers/       # Stimulus controllers
          <name>_controller.js
      models/              # ActiveRecord models
        <name>.rb
`);
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  try {
    const args = process.argv.slice(2);
    const cli = new CLI(args);
    await cli.run();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  ComponentAnalyzer,
  ViewComponentGenerator,
  StimulusGenerator,
  ModelGenerator,
  CLI
};
