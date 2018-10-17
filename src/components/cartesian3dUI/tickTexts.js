
import { Component } from '../Component';
import { Vector3, TextTexture, Box3 } from 'mmgl/src/index';

// {
//     enabled: 1,
//     fontColor: '#999',
//     fontSize: 16,
//     format: null,
//     rotation: 0,
//     textAlign: null,//"right",
//     lineHeight: 1,
//     offset: 2     //和刻度线的距离
// }
class TickTexts extends Component {
    constructor(_coordSystem, opts) {
        super(_coordSystem);

        //起点位置集合
        this.origins = [];
        this.texts = [];

        this.fontColor = opts.fontColor || '#333';

        this.fontSize = opts.fontSize || 12;

        this.rotation = 0;

        this.origin = null;

        this.textAlign = opts.textAlign;

        this.verticalAlign = opts.verticalAlign;

        this.dir = new Vector3();

        this.offset = new Vector3(...Object.values(opts.offset)) || new Vector3();

        this._tickTextGroup = null;

        this._tickTextGroup = this._root.renderView.addGroup({ name: 'tickTexts' });

        this.group.visible = !!opts.enabled;
        this.group.add(this._tickTextGroup);
    }


    initData(axis, attribute, fn) {
        let me = this;
        let _dir = me.dir.clone();
        //let _offset = _dir.multiplyScalar(this.offset);
        let _offset = this.offset;
        me.origins = [];

        attribute.getSection().forEach((num, index) => {
            //起点
            let val = fn.call(this._coordSystem, num)
            let startPoint = axis.dir.clone().multiplyScalar(val);
            startPoint.add(axis.origin);
            startPoint.add(_offset);
            me.origins.push(startPoint);

        });

        me.updataOrigins = this._updataOrigins(axis, attribute, fn)
    }

    setDir(dir) {
        this.dir = dir;
    }
    setTextAlign(align) {
        this.textAlign = align;
    }
    setVerticalAlign(align) {
        this.verticalAlign = align;
    }

    _updataOrigins(axis, attribute, fn) {
        let _axis = axis;
        let _attribute = attribute;
        let _fn = fn;
        return function () {
            this.initData(_axis, _attribute, _fn);
        }
    }

    drawStart(texts) {
        let me = this;
        (texts || []).forEach((text, index) => {
            let obj = me._root.renderView.createTextSprite(text.toString(), me.fontSize, me.fontColor)
            //obj.userData.lastScale = new Vector3();
            let oldFn = obj.onBeforeRender;
            obj.onBeforeRender = function () {
                oldFn.apply(obj, arguments);
                // if (!this.scale.clone().floor().equals(obj.userData.lastScale)) {
                // this.userData.lastScale.copy(this.scale.clone().floor());
                me.updataOrigins();
                obj.position.copy(me.origins[index]);
                //obj.position.add(me.offset);

                //todo 默认center 居中对齐
                let camearDir = new Vector3();

                me._root.renderView._camera.getWorldDirection(camearDir);
                let isSameDir = new Vector3(0, 0, -1).dot(camearDir);


                if (me.textAlign == 'right') {
                    let flag = isSameDir < 0 ? 1 : -1;
                    //console.log(text, 'right', isSameDir); //this.scale.x, obj.position.x,offsetX
                    obj.position.add(new Vector3((this.scale.x) * 0.5 * flag, 0, 0));
                }
                if (me.textAlign == 'left') {

                    let flag = isSameDir < 0 ? -1 : 1;

                    //console.log(text, 'left');
                    obj.position.add(new Vector3((this.scale.x) * 0.5 * flag, 0, 0));
                }
                if (me.verticalAlign == 'top') {
                    //console.log(text, 'top');
                    obj.position.add(new Vector3(0, -(this.scale.y) * 0.5, 0));
                }
                if (me.verticalAlign == 'bottom') {
                    //console.log(text, 'bottom');
                    obj.position.add(new Vector3(0, (this.scale.y) * 0.5, 0));
                }

                //console.log(`sprite ${this.id}`, maxSize, this.scale)
                // }

            }


            me._tickTextGroup.add(obj);

        })





    }
    draw() {

        this.group.add(this._tickTextGroup);
    }

    update() {
        //文字需要实时更新
    }
    // getBoundBox() {
    //     //todo 需要重构底层绘图引擎的Sprite的绘制,将Geometry转移到Sprite类中
    //     //没有计算文本旋转后的长度
    //     let result = new Box3();
    //     result.makeEmpty();
    //     this._tickTexts.traverse(function (sprite) {
    //         if (sprite instanceof Sprite) {
    //             let min = new Vector3();
    //             let max = new Vector3();
    //             let halfScale = new Vector3();
    //             halfScale.copy(sprite.scale);
    //             halfScale.multiplyScalar(0.5);
    //             min.copy(sprite.position);
    //             max.copy(sprite.position);

    //             min.sub(halfScale);
    //             max.add(halfScale);

    //             result.expandByPoint(min);
    //             result.expandByPoint(max);
    //         }
    //     });
    //     return result;
    // }
    dispose() {
        let remove = [];
        this.group.traverse((obj) => {
            if (obj.isTextSprite) {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                if (obj.material) {
                    obj.material.dispose();
                    if (obj.material.map) {
                        obj.material.map.dispose();
                    }
                }
                remove.push(obj);

            }
        });
        while (remove.length) {
            let obj = remove.pop();
            obj.parent.remove(obj);
        }

    }


}

export { TickTexts };