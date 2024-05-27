import u from 'umbrellajs'


u.prototype.css = function (styleProps: string) {

    return this.each(
        function iterator( node: HTMLElement ) {

            Object.assign( node.style, styleProps );

        }
    );

};