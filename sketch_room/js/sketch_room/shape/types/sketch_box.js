class SketchBox extends SketchShape {
    constructor(parent) {
        super(parent, ShapeType.BOX);

        this._buildObject();
    }

    clone() {
        let clone = new SketchBox(this._myParentObject);
        clone.setPosition(this.getPosition());
        clone.setRotation(this.getRotation());
        clone.setScale(this.getScale());
        clone.setColor(this.getColor());
        return clone;
    }

    _buildObject() {
        this._myObject = WL.scene.addObject(this._myParentObject);

        this._myShape = this._myObject.addComponent('sketch-shape');
        this._myShape.myShape = this;

        this._myMesh = this._myObject.addComponent('mesh');
        this._myMesh.mesh = SketchShapeData.myCubeMesh;
        this._myMesh.material = SketchShapeData.myShapeMaterial.clone();

        this._myCursorTarget = this._myObject.addComponent('cursor-target');
        this._myCollision = this._myObject.addComponent('collision');
        this._myCollision.collider = WL.Collider.Box;
        this._myCollision.group = 1 << SketchShapeData.myCollisionGroup;
        this._myCollision.extents = [1, 1, 1];
    }
}