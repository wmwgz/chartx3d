import { Events } from "mmgl/src/index";
import { _ } from 'mmvis';

//组件的标准
class Component extends Events {
    constructor(_coordSystem, root) {
        super();

        this._coordSystem = _coordSystem;
        this._root = _coordSystem ? _coordSystem._root : root;

        // //每一个组件存放在一个Group中
        // this.group = new Group();
        // this.name = '';
        this.group = this._root.app.addGroup({
            name: this.constructor.name.toLowerCase() + '_root'
        });


        this.__mouseover = null;
        this.__mouseout = null;
        this.__mousemove = null;
        this.__click = null;

    }
    setGroupName(name) {
        this.group.name = name;
    }

    dispose(group) {
        let removes = [];
        group = group || this.group;
        group.traverse(obj => {
            if (obj.isMesh || obj.isLine || obj.isLine2 || obj.isSprite) {
                if (obj.geometry) {
                    obj.geometry.dispose();
                }
                if (obj.material) {
                    obj.material.dispose();
                }
                removes.push(obj);
            }
        });
        while (removes.length) {
            let obj = removes.pop();
            if (obj.parent) {
                obj.parent.remove(obj);
            } else {
                obj = null;
            }

        }
        this.__mouseover = null;
        this.__mouseout = null;
        this.__mousemove = null;
        this.__click = null;
    }
    draw() {
        //基类不实现
    }
    resetData() {

    }
    //后续组件的公共部分可以提取到这里

}

export { Component, _ };