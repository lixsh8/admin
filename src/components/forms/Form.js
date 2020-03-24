/* eslint-disable */
import ZImageUpload from "./ImageUpload";
import ZJsonEditor from "./JsonEditor";
import ZRangePicker from "./RangePicker";
import ZIconPicker from "./IconPicker";
import ZRichText from "./RichText";

import _ from "lodash";

function resolveProps(vm, de, componentProps) {
  if (typeof componentProps === "function") return componentProps(vm, de);
  if (Array.isArray(componentProps)) {
    const props = {};
    componentProps.forEach(it => {
      if (de.hasOwnProperty(it)) {
        props[it] = de[it];
      }
    });
    return props;
  }
  return componentProps;
}

function createComponentOptions(vm, de, c) {
  // props
  const componentProps = resolveProps(vm, de, c.props);
  const definitionProps = {};
  if (de.placeholder === true) {
    definitionProps.placeholder = makePlaceholder(vm, de);
  } else if (de.placeholder) {
    definitionProps.placeholder = de.placeholder;
  }
  if (Array.isArray(de.options)) {
    definitionProps.options = de.options;
  } else if (typeof de.options === "string") {
    definitionProps.options = vm.state[de.options];
  }
  if (de.readonly && vm.edit === true) {
    definitionProps.disabled = true;
  }
  const props = { ...de.props, ...definitionProps, ...componentProps };

  const directives = Array.isArray(de.directives) ? [...de.directives] : [];
  if (de.key) {
    const { initialValue } = de;
    const rules = Array.isArray(de.rules) ? de.rules : makeRules(vm, de);
    const valuePropName = c.valuePropName || "value";
    const decorator = {
      name: "decorator",
      value: [de.key, { initialValue, rules, valuePropName }]
    };
    directives.push(decorator);
  }

  const on = {};
  if (de.type === "submit") {
    on.click = () => {
      vm.validate((values, model) => {
        vm.$emit("submit", values, model);
      });
    };
  } else if (de.type === "reset") {
    on.click = () => vm.reset();
  }

  return { props, directives, on };
}

function makeRules(vm, de) {
  const messages = typeof de.messages === "object" ? de.messages : {};
  const rules = [];
  const { required } = de.__resolved;
  if (required) {
    const message = messages.required || makeMessageRequired(vm, de);
    rules.push({ required: true, message });
  }
  if (de.pattern) {
    rules.push({
      pattern: de.pattern,
      message: messages.pattern || "格式不对"
    });
  }
  return rules;
}

function makePlaceholder(vm, de) {
  if (["text", "textarea", "number"].indexOf(de.type) > -1) {
    return `请输入${de.name || de.title}`;
  }
  if (["select", "cascader"].indexOf(de.type) > -1) {
    return `请选择${de.name || de.title}`;
  }
  return null;
}

function makeMessageRequired(vm, de) {
  if (["text", "textarea", "json", "number"].indexOf(de.type) > -1) {
    return `请输入${de.name || de.title}`;
  }
  if (
    [
      "select",
      "cascader",
      "checkboxgroup",
      "timerange",
      "time",
      "date"
    ].indexOf(de.type) > -1
  ) {
    return `请选择${de.name || de.title}`;
  }
  if (de.type === "image") {
    return `请上传图片`;
  }
  return `${de.name || de.title}是必须的`;
}

function createItemOptions(de, itemProps) {
  const props = { ...itemProps };
  if (de.title) {
    props.label = de.title;
  }
  if (de.description) {
    props.extra = de.description;
  }

  const { required, visible } = de.__resolved;
  if (required) {
    props.required = true;
  }
  ["colon", "labelCol", "wrapperCol", "selfUpdate"].forEach(prop => {
    if (de.hasOwnProperty(prop)) {
      props[prop] = de[prop];
    }
  });

  const style = {};
  if (de.type === "inline" || de.type === "fieldset") {
    style.marginBottom = 0;
  }
  if (!visible) {
    style.display = "none";
  }
  return { style, props };
}

function createComponent(vm, de) {
  if (COMPONENTS.hasOwnProperty(de.type)) {
    const c = COMPONENTS[de.type];
    if (typeof c === "string") {
      return [vm.$createElement(c, createComponentOptions(vm, de, c))];
    } else if (typeof c === "object") {
      const children =
        typeof c.children === "function" ? c.children(vm, de) : undefined;
      return [
        vm.$createElement(c.tag, createComponentOptions(vm, de, c), children)
      ];
    } else if (typeof c === "function") {
      return c(vm, de);
    }
  }
  return undefined;
}

function matchObject(object, values) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (!values.hasOwnProperty(key) || object[key] !== values[key]) {
        return false;
      }
    }
  }
  return true;
}
function matchExpression(expression, state, values) {
  // eslint-disable-next-line no-new-func
  return new Function("state", "data", "return " + expression)(state, values);
}

function resolveBoolean(vm, de, value) {
  if (value === true) return true;
  if (typeof value === "string")
    return matchExpression(value, vm.state, vm.form.getFieldsValue()) === true;
  if (typeof value === "object" && matchObject(value, vm.form.getFieldsValue()))
    return true;
  return false;
}

function resolveVisible(vm, de) {
  if (de.collapsible === true && vm.collapsed === true) return false;
  return !de.hasOwnProperty("visible") || resolveBoolean(vm, de, de.visible);
}

const createItem = (vm, de, props) => {
  if (
    typeof de.exists === "string" &&
    !matchExpression(de.exists, vm.state, vm.form.getFieldsValue())
  ) {
    return undefined;
  }
  de.__resolved = {};
  de.__resolved.required = resolveBoolean(vm, de, de.required);
  de.__resolved.visible = resolveVisible(vm, de);

  const component = createComponent(vm, de);
  const options = createItemOptions(de, props);
  return vm.$createElement("a-form-item", options, component);
};

function createRow(vm, items, props, itemProps) {
  if (!Array.isArray(items)) return undefined;

  // cols
  const cols = items.map(item => {
    return vm.$createElement("a-col", { props: { span: item.span } }, [
      createItem(vm, item, itemProps)
    ]);
  });

  // row
  const rowOptions = {
    props: {
      type: "flex",
      justify: props.justify,
      gutter: 15
    }
  };
  return [vm.$createElement("a-row", rowOptions, cols)];
}

const COMPONENTS = {
  inline: (vm, de) =>
    createRow(vm, de.items, { justify: de.justify || "start" }),
  fieldset: (vm, de) =>
    Array.isArray(de.items)
      ? de.items.map(item => createItem(vm, item))
      : undefined,

  checkbox: {
    tag: "a-checkbox",
    valuePropName: "checked",
    children: (vm, de) => de.label
  },
  switch: { tag: "a-switch", valuePropName: "checked" },
  image: { tag: "z-image-upload", props: ["imagePath"] },
  json: "z-json-editor",

  richtext: { tag: "z-rich-text" },
  textarea: { tag: "a-textarea", props: { autosize: { minRows: 4 } } },
  text: "a-input",
  number: { tag: "a-input-number", props: ["min", "max", "step"] },
  rate: { tag: "a-rate", props: ["count", "allowHalf"] },
  slider: { tag: "a-slider", props: ["min", "max", "step"] },

  select: "a-select",
  cascader: "a-cascader",
  checkboxgroup: "a-checkbox-group",

  submit: {
    tag: "a-button",
    props: { type: "primary" },
    children: (vm, de) => de.label || "提 交"
  },
  reset: { tag: "a-button", children: (vm, de) => de.label || "重 置" },

  icon: "z-icon-picker",
  date: "a-date-picker",
  time: "a-time-picker",
  timerange: "z-range-picker"
};

export default {
  name: "ZForm",
  components: {
    ZImageUpload,
    ZJsonEditor,
    ZRangePicker,
    ZIconPicker,
    ZRichText
  },
  props: {
    // schema: { type: Object, required: true },
    definitions: { type: Array, required: true },
    value: { type: Object, default: () => ({}) },
    state: { type: Object, default: () => ({}) },
    layout: { type: String },
    justify: { type: String, default: "space-between" },
    collapsed: { type: Boolean, default: true },
    labelSpan: { type: Number, default: 7 },
    wrapperSpan: { type: Number, default: 13 }
  },
  data() {
    return {
      edit: false,
      model: {},
      itemProps: {
        labelCol: { span: this.labelSpan },
        wrapperCol: { span: this.wrapperSpan }
      },
      form: this.$form.createForm(this)
    };
  },
  computed: {
    fields() {
      return _.flattenDeep(
        this.definitions.map(it => {
          if (it.type === "inline" || it.type === "fieldset") {
            return it.items.map(sub => sub.key);
          }
          return it.key;
        })
      ).map(key => (key.indexOf(".") >= 0 ? key.split(".") : key));
      // return this.definitions
      //   .map(it => {
      //     if (it.type === "inline" || it.type === "fieldset") {
      //       return it.items.map(sub => sub.key);
      //     }
      //     return it.key;
      //   })
      //   .flat()
      //   .map(key => (key.indexOf(".") >= 0 ? key.split(".") : key));
    },
    collapsible() {
      return this.definitions.some(it => {
        if (it.collapsible === true) return true;
        if (it.type === "inline" || it.type === "fieldset") {
          return it.items.some(sub => sub.collapsible === true);
        }
        return false;
      });
    }
  },
  render(createElement) {
    const { form, layout, $slots, justify } = this;
    var children;
    if (layout === "inline") {
      children = createRow(this, this.definitions, { justify });
    } else {
      children = this.definitions.map(item =>
        createItem(this, item, this.itemProps)
      );
    }
    if ($slots.default && $slots.default.length > 0) {
      children.push(<slot>{$slots.default}</slot>);
    }
    return createElement(
      "a-form",
      { ref: "form", props: { form, layout } },
      children
    );
  },
  methods: {
    onReset() {
      this.form.resetFields();
    },
    reset() {
      this.$nextTick(() => {
        this.form.resetFields();
      });
    },
    update(model, edit = false) {
      this.edit = edit;
      this.model = model;
      this.$nextTick(() => {
        this.form.resetFields();
        const values = _.pick(model, this.fields);
        this.form.setFieldsValue(values);
        console.log("fields updated => ", _.cloneDeep(values));
      });
    },
    validate(callback) {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          console.log("fields validated => ", _.cloneDeep(values));
          // for (var item in values) {
          //   if (values[item] === "") {
          //     values[item] = undefined;
          //   }
          // }
          callback(values, this.model);
        }
      });
    }
  }
};
