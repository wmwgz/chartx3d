import { Component, _ } from "../Component";
import { Axis } from './axis';
import { FaceNames } from '../../constants';
import { Vector3, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, CircleBufferGeometry, BoxGeometry, Mesh, Math as _Math } from 'mmgl/src/index';


class CubeUI extends Component {
    constructor(_coordSystem) {
        super(_coordSystem);

        this.name = 'CubeUI';
        this.faceAxises = {};
        for (let key in FaceNames) {
            this.faceAxises[FaceNames[key]] = [];
        }
        this.init();
    }
    init() {
        this._initModules();

    }
    _initModules() {
        let _coordSystem = this._coordSystem;
        let opt = null;
        let axises = this.faceAxises;
        //_dir === 'FRONT'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.FRONT);
            //初始化X轴
            opt = _.clone(_coordSystem.coord.xAxis);
            let xAxis = new Axis(this, opt)
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(1, 0, 0));
            xAxis.setTickLineDir(new Vector3(0, -1, 0))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.FRONT].push(xAxis);


            //初始化Y轴
            opt = _.clone(_coordSystem.coord.yAxis);
            let yAxis = new Axis(this, opt);

            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 1, 0));
            yAxis.setTickLineDir(new Vector3(-1, 0, 0))
            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.FRONT].push(yAxis);
        }

        //_dir === 'BACK'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.BACK);
            //初始化X轴
            opt = _.clone(_coordSystem.coord.xAxis);
            let xAxis = new Axis(this, opt)
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(-1, 0, 0));
            xAxis.setTickLineDir(new Vector3(0, -1, 0))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.BACK].push(xAxis);
            //初始化Y轴
            opt = _.clone(_coordSystem.coord.yAxis);
            let yAxis = new Axis(this, opt)
            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 1, 0));
            yAxis.setTickLineDir(new Vector3(1, 0, 0))
            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.BACK].push(yAxis);
        }



        //_dir === 'LEFT'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.LEFT);
            //初始化X轴 实际为Z轴
            opt = _.clone(_coordSystem.coord.xAxis);
            opt.field = _coordSystem.coord.zAxis.field;
            let xAxis = new Axis(this, opt);
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(0, 0, 1));
            xAxis.setTickLineDir(new Vector3(0, -1, 0))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.LEFT].push(xAxis);

            //初始化Y轴
            opt = _.clone(_coordSystem.coord.yAxis);
            opt.label.textAlign = 'right';
            let yAxis = new Axis(this, opt);
            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 1, 0));
            yAxis.setTickLineDir(new Vector3(0, 0, -1))
            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.LEFT].push(yAxis);
        }
        //_dir === 'RIGHT'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.RIGHT);

            //测试原地
            // let point = new Mesh(new CircleBufferGeometry(2), new MeshBasicMaterial({ color: 'red' }));
            // let pos = origin.clone();
            // pos.z += 0;
            // point.position.copy(pos);

            // this.group.add(point);

            //初始化X轴 实际为Z轴
            opt = _.clone(_coordSystem.coord.xAxis);
            opt.field = _coordSystem.coord.zAxis.field;
            let xAxis = new Axis(this, opt);
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(0, 0, -1));
            xAxis.setTickLineDir(new Vector3(0, -1, 0))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.RIGHT].push(xAxis);

            //初始化Y轴
            opt = _.clone(_coordSystem.coord.yAxis);
            //opt.label.offset = 40;
            //opt.label.textAlign = "";
            let yAxis = new Axis(this, opt);
            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 1, 0));
            yAxis.setTickLineDir(new Vector3(0, 0, 1))

            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.RIGHT].push(yAxis);
        }

        //_dir === 'TOP'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.TOP);
            //初始化X轴
            opt = _.clone(_coordSystem.coord.xAxis);
            let xAxis = new Axis(this, opt)
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(1, 0, 0));
            xAxis.setTickLineDir(new Vector3(0, 0, 1))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.TOP].push(xAxis);

            //修复top面 X轴label的位置
            xAxis.group.traverse(label => {
                if (label.type == "Sprite") {
                    label.position.add(new Vector3(0, 0, 1).multiplyScalar(label.userData.size[1] * 0.5))
                }
            })
            //

            //初始化Y轴 实际为Z轴
            opt = _.clone(_coordSystem.coord.yAxis);
            opt.field = _coordSystem.coord.zAxis.field;

            //opt.label.textAlign = 'right';
            let yAxis = new Axis(this, opt)
            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 0, -1));
            yAxis.setTickLineDir(new Vector3(-1, 0, 0))
            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.TOP].push(yAxis);
        }

        //_dir === 'BOTTOM'
        {
            let origin = _coordSystem.getOriginPosition(FaceNames.BOTTOM);
            //初始化X轴
            opt = _.clone(_coordSystem.coord.xAxis);
            let xAxis = new Axis(this, opt)
            xAxis.setOrigin(origin.clone());
            xAxis.setAxisDir(new Vector3(1, 0, 0));
            xAxis.setTickLineDir(new Vector3(0, 0, -1))
            xAxis.initModules();
            this.group.add(xAxis.group);
            axises[FaceNames.BOTTOM].push(xAxis);

            //初始化Y轴 实际为Z轴
            opt = _.clone(_coordSystem.coord.yAxis);
            opt.field = _coordSystem.coord.zAxis.field
            let yAxis = new Axis(this, opt)
            yAxis.setOrigin(origin.clone());
            yAxis.setAxisDir(new Vector3(0, 0, 1));
            yAxis.setTickLineDir(new Vector3(-1, 0, 0))
            yAxis.initModules();
            this.group.add(yAxis.group);
            axises[FaceNames.BOTTOM].push(yAxis);
        }


        {
            let {
                width,
                height,
                depth } = this._coordSystem.getGraphAreaSize();

            let getBasicMaterial = () => {
                return new MeshLambertMaterial({
                    polygonOffset: true,
                    polygonOffsetFactor: 1,
                    polygonOffsetUnits: 0.1,
                    color: '#FFFFFF'
                });
            }
            let geometry = new BoxGeometry(width, height, depth);
            this.box = new Mesh(geometry, getBasicMaterial());

        }

    }
    hideAxis() {
        for (let key in FaceNames) {
            let name = FaceNames[key];
            this.faceAxises[name].forEach(axis => {
                axis.setVisibel(false);
            });
        }
    }
    showAxis() {
        let dir = this._coordSystem.getDirection();
        for (let key in FaceNames) {
            let name = FaceNames[key];
            this.faceAxises[name].forEach(axis => {
                axis.setVisibel(false);
                if (name == dir) {
                    axis.setVisibel(true);
                }
            });
        }
    }
    draw() {
        // let app = this._root.app;
        // app._framework.on('renderbefore', () => {
        //     // box.rotation.x+=0.01;
        // })

        this.group.add(this.box);
        let dir = this._coordSystem.getDirection();
        for (let key in FaceNames) {
            let name = FaceNames[key];
            this.faceAxises[name].forEach(axis => {
                axis.setVisibel(false);
                if (name == dir) {
                    axis.setVisibel(true);
                }
                axis.draw();
            });
        }


    }
    dispose() {

        for (let key in FaceNames) {
            let name = FaceNames[key];
            this.faceAxises[name].forEach(axis => {
                axis.dispose();
            });
        }
        this.faceAxises = null;
        super.dispose(this.box);
    }
    resetData() {

        for (let key in FaceNames) {
            let name = FaceNames[key];
            this.faceAxises[name].forEach(axis => {
                axis.resetData();
            });
        }

    }
}

export { CubeUI }