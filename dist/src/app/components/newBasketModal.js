"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// JSON files
const templates_json_1 = __importDefault(require("../assets/templates.json"));
// External Files
const jsonEditor = require('vue-json-editor').default;
// Templates
const newBasketModalTemplate = require('../templates/newBasketModal.html');
// Components
const modal = require('./modal.ts');
const card = require('./card.ts');
const newBasketModal = {
    name: 'newBasketModal',
    template: newBasketModalTemplate,
    props: ['visible'],
    components: {
        modal,
        card,
        'json-edit': jsonEditor,
    },
    data() {
        return {
            templates: templates_json_1.default,
            basketName: 'my-new-basket-name',
            pathToTemplates: '../assets/templates/',
            payload: null,
        };
    },
    computed: {
        payloadIsNotEmpty() {
            return this.payload !== null;
        },
        valid() {
            return this.payload && this.basketName;
        },
    },
    methods: {
        close() {
            this.$emit('close');
        },
        setTemplate(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                const file = yield Promise.resolve().then(() => __importStar(require(`../assets/templates/${fileName}.json`)));
                this.payload = file.default;
            });
        },
        setBlankTemplate() {
            this.payload = {};
        },
        createBasket() {
            if (this.valid) {
                this.$emit('createBasket', this.basketName, this.payload);
            }
            else {
                alert('Please enter a name & select a starting template');
            }
        },
        closeModal() {
            this.$emit('close');
        },
    },
    updated() {
        if (this.visible) {
            document.getElementById('newBasketName').focus();
        }
    },
};
module.exports = newBasketModal;
