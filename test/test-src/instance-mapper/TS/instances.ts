// Valid ClassDeclaration
export class AClass {
    private fooBClass: BClass;
    private barBClass: BClass;
    foo () {
        this.fooBClass = new BClass()
        const constFooBClass = new BClass()
        let letFooBClass = new BClass()
    }

    bar = () => {
        this.barBClass = new BClass()
        const constBarBClass = new BClass()
        let letBarBClass = new BClass()
    }
    baz = function () {
        this.bazBClass = new BClass()
        const constBazBClass = new BClass()
        let letBazBClass = new BClass()
    }
    dummy = 1
}

// Valid ClassDeclaration
class BClass extends AClass {
    private fooCClass: CClass;
    private barCClass: CClass;
    foo () {
        this.fooCClass = new CClass()
        const constFooCClass = new CClass()
        let letFooCClass = new CClass()
    }

    bar = () => {
        this.barCClass = new CClass()
        const constBarCClass = new CClass()
        let letBarCClass = new CClass()
    }
    baz = function () {
        this.bazCClass = new CClass()
        const constBazCClass = new CClass()
        let letBazCClass = new CClass()
    }
    dummy = 1
}

// Valid ClassDeclaration (Using identifier Foo as name of the class)
export default class CClass {
    // TS cannot find DClass: TS2749: DClass refers to a value, but is being used as a type here. Did you mean typeof DClass?
    private fooDClass: any
    private barDClass: any
    foo () {
        this.fooDClass = new DClass()
        const constFooDClass = new DClass()
        let letFooCDClass = new DClass()
    }

    bar = () => {
        this.barDClass = new DClass()
        const constBarDClass = new DClass()
        let letBarDClass = new DClass()
    }
    baz = function () {
        this.bazDClass = new DClass()
        const constBazDClass = new DClass()
        let letBazDClass = new DClass()
    }
    dummy = 1
}

// Valid ClassExpression
const DClass = class {
    private fooAClass: AClass;
    private barAClass: AClass;
    foo () {
        this.fooAClass = new AClass()
        const constFooAClass= new AClass()
        let letFooAClass = new AClass()
    }

    bar = () => {
        this.barAClass = new AClass()
        const constBarAClass = new AClass()
        let letBarAClass = new AClass()
    }
    baz = function () {
        this.bazAClass = new AClass()
        const constBazAClass = new AClass()
        let letBazAClass = new AClass()
    }
    dummy = 1
}

// Valid ClassExpression
const myObject = {
    EClass: class {
        private fooAClass: AClass;
        private barAClass: AClass;
        foo () {
            this.fooAClass = new AClass()
            const constFooAClass = new AClass()
            let letFooAClass = new AClass()
        }

        bar = () => {
            this.barAClass = new AClass()
            const constBarAClass = new AClass()
            let letBarAClass = new AClass()
        }
        baz = function () {
            this.bazAClass = new AClass()
            const constBazAClass = new AClass()
            let letBazAClass = new AClass()
        }
        dummy = 1
    }
}

// Valid ClassExpression
const object = {
    ['LiteralClassName']: class {
        private fooAClass: AClass
        private barAClass: AClass;
        foo () {
            this.fooAClass = new AClass()
            const constFooAClass = new AClass()
            let letFooAClass = new AClass()
        }

        bar = () => {
            this.barAClass = new AClass()
            const constBarAClass = new AClass()
            let letBarAClass = new AClass()
        }
        baz = function () {
            this.bazAClass = new AClass()
            const constBazAClass = new AClass()
            let letBazAClass = new AClass()
        }
        dummy = 1
    }
};

// Invalid ClassDeclaration
(() => { class NotCounted1 {} })()

// Invalid ClassDeclaration
class NotCounted2 extends class {} {}

// Invalid ClassExpression
const NotCounted4 = class NotCounted3 extends class {} {};

// Invalid ClassExpression
(() => { const NotCounted6 = class NotCounted5 extends class {} {} })()

