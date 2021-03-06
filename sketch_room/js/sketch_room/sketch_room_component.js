WL.registerComponent('sketch-room-component', {
    _myShapeMaterial: { type: WL.Type.Material, default: null },
    _myWallMaterial: { type: WL.Type.Material, default: null },
    _myPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null },
    _myLightObject: { type: WL.Type.Object, default: null },
    _myShapeOutlineObject10CM: { type: WL.Type.Object, default: null },
    _myShapeOutlineObject5CM: { type: WL.Type.Object, default: null },
    _myInvertedCubeObject: { type: WL.Type.Object, default: null },
}, {
    init: function () {
        this._initializeSketchShapeData();
        this._initializeWidgetData();
        this._initializeWallData();

        this._mySceneObject = WL.scene.addObject(this.object);
        this._myManager = new SketchRoomManager(this._mySceneObject, this._myLightObject);
    },
    start: function () {
        this._myManager.start();
    },
    update: function (dt) {
        this._myManager.update(dt);
    },
    _initializeSketchShapeData: function () {
        SketchShapeData.myCubeMesh = PP.MeshUtils.createCubeMesh();
        SketchShapeData.myShapeMaterial = this._myShapeMaterial;
        SketchShapeData.myWallMaterial = this._myWallMaterial;
        SketchShapeData.myCollisionGroup = 1;
    },
    _initializeWidgetData: function () {
        WidgetData.myPlaneMaterial = this._myPlaneMaterial;
        WidgetData.myTextMaterial = this._myTextMaterial;
        WidgetData.myPlaneMesh = PP.MeshUtils.createPlaneMesh();
    },
    _initializeWallData: function () {
        OutlineData.myShapeOutlineObject10CM = this._myShapeOutlineObject10CM;
        OutlineData.myShapeOutlineObject5CM = this._myShapeOutlineObject5CM;
        OutlineData.myInvertedCubeObject = this._myInvertedCubeObject;
    }
});