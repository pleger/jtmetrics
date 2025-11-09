import { AClass } from './instances'

export default class {
    private fooDClass: AClass;
    private barDClass: AClass;
    foo () {
        this.fooDClass = new AClass()
        const constFooDClass = new AClass()
        let letFooCDClass = new AClass()
    }

    bar = () => {
        this.barDClass = new AClass()
        const constBarDClass = new AClass()
        let letBarDClass = new AClass()
    }
    baz = function () {
        this.bazDClass = new AClass()
        const constBazDClass = new AClass()
        let letBazDClass = new AClass()
    }
    dummy = 1
}