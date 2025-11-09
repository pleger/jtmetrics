import { DeclaredClass } from './DeclaredClass';

export const ExpressedClass = class {
    declaredClass: DeclaredClass;

    constructor() {
        this.declaredClass = new DeclaredClass();
    }

    expressedMethod(): void {
        this.declaredClass.declaredMethod()

        const dClass = new DeclaredClass()
        dClass.declaredMethod()
    }
}
