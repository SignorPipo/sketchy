class BoxShapeWidget {
    constructor(toolSettings) {
        this._myToolSettings = toolSettings;
        this._myAdditionalSetup = null;
        this._mySetup = new BoxShapeWidgetSetup();
        this._myUI = new BoxShapeWidgetUI();

        this._mySelectedShape = null;
        this._myIsVisible = false;

        this._myHeightHover = false;
        this._myWidthHover = false;
        this._myDepthHover = false;
    }

    setSelectedShape(shape) {
        this._mySelectedShape = shape;
        this._refreshShapeData();
    }

    setVisible(visible) {
        this._myUI.setVisible(visible);
        this._myIsVisible = visible;
        if (visible) {
            this._refreshShapeData();
        }
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._addListeners();
    }

    isUsingThumbstick() {
        return this._myHeightHover || this._myWidthHover || this._myDepthHover;
    }

    update(dt) {
        if (this._myIsVisible) {
            this._updateGamepad(dt);
            this._refreshShapeData();
        }
    }

    _updateGamepad(dt) {
        let intensity = 0;

        {
            let y = PP.RightGamepad.getAxesInfo().myAxes[1];

            if (Math.abs(y) > this._mySetup.myModifyThumbstickMinThreshold) {
                let normalizedModifyAmount = (Math.abs(y) - this._mySetup.myModifyThumbstickMinThreshold) / (1 - this._mySetup.myModifyThumbstickMinThreshold);
                intensity = Math.sign(y) * normalizedModifyAmount;
            }
        }

        if (intensity != 0) {
            let amountToAdd = intensity * this._mySetup.myModifyThumbstickStepPerSecond * dt;

            let halfSize = this._mySelectedShape.getScale();
            if (this._myHeightHover) {
                halfSize[1] = Math.max(0.005, halfSize[1] + amountToAdd);
            }
            if (this._myWidthHover) {
                halfSize[0] = Math.max(0.005, halfSize[0] + amountToAdd);
            }
            if (this._myDepthHover) {
                halfSize[2] = Math.max(0.005, halfSize[2] + amountToAdd);
            }
            this._mySelectedShape.setScale(halfSize);
            this._refreshShapeData();
        } else if (this._myHeightHover || this._myWidthHover || this._myDepthHover) {
            this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
        }
    }

    _refreshShapeData() {
        if (this._mySelectedShape) {
            let size = this._mySelectedShape.getScale();
            glMatrix.vec3.scale(size, size, 2);

            this._myUI.myHeightValueTextComponent.text = size[1].toFixed(3);
            this._myUI.myWidthValueTextComponent.text = size[0].toFixed(3);
            this._myUI.myDepthValueTextComponent.text = size[2].toFixed(3);

            for (let i = 0; i < this._myUI.myColorButtonsSelectedBackgrounds.length; i++) {
                this._myUI.myColorButtonsSelectedBackgrounds[i].scale([0, 0, 0]);
            }

            let colorIndex = this._mySetup.myColors.findIndex(function (value) { return glMatrix.vec4.equals(value, this._mySelectedShape.getColor()); }.bind(this));
            if (colorIndex >= 0) {
                this._myUI.myColorButtonsSelectedBackgrounds[colorIndex].resetScaling();
                this._myUI.myColorButtonsSelectedBackgrounds[colorIndex].scale(this._mySetup.myColorSelectedBackgroundScale);
            }
        }
    }

    _addListeners() {
        this._myUI.myHeightValueCursorTargetComponent.addHoverFunction(this._heightHover.bind(this));
        this._myUI.myHeightValueCursorTargetComponent.addUnHoverFunction(this._heightUnHover.bind(this));
        this._myUI.myWidthValueCursorTargetComponent.addHoverFunction(this._widthHover.bind(this));
        this._myUI.myWidthValueCursorTargetComponent.addUnHoverFunction(this._widthUnHover.bind(this));
        this._myUI.myDepthValueCursorTargetComponent.addHoverFunction(this._depthHover.bind(this));
        this._myUI.myDepthValueCursorTargetComponent.addUnHoverFunction(this._depthUnHover.bind(this));

        for (let i = 0; i < this._myUI.myColorButtonsCursorTargetComponents.length; i++) {
            this._myUI.myColorButtonsCursorTargetComponents[i].addClickFunction(this._changeColor.bind(this, i));
            this._myUI.myColorButtonsCursorTargetComponents[i].addHoverFunction(this._colorHover.bind(this, i));
            this._myUI.myColorButtonsCursorTargetComponents[i].addUnHoverFunction(this._colorUnHover.bind(this, i));
        }
    }

    _heightHover() {
        this._myHeightHover = true;
        this._sizeHover(this._myUI.myHeightLabelTextComponent, this._myUI.myHeightValueTextComponent);
    }

    _heightUnHover() {
        this._myHeightHover = false;
        this._sizeUnHover(this._myUI.myHeightLabelTextComponent, this._myUI.myHeightValueTextComponent);
    }

    _widthHover() {
        this._myWidthHover = true;
        this._sizeHover(this._myUI.myWidthLabelTextComponent, this._myUI.myWidthValueTextComponent);
    }

    _widthUnHover() {
        this._myWidthHover = false;
        this._sizeUnHover(this._myUI.myWidthLabelTextComponent, this._myUI.myWidthValueTextComponent);
    }

    _depthHover() {
        this._myDepthHover = true;
        this._sizeHover(this._myUI.myDepthLabelTextComponent, this._myUI.myDepthValueTextComponent);
    }

    _depthUnHover() {
        this._myDepthHover = false;
        this._sizeUnHover(this._myUI.myDepthLabelTextComponent, this._myUI.myDepthValueTextComponent);
    }

    _sizeHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myHoverTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
        valueTextComponent.material.color = this._mySetup.myHoverTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myHoverTextColor;
    }

    _sizeUnHover(labelTextComponent, valueTextComponent) {
        labelTextComponent.material.color = this._mySetup.myTextColor;
        labelTextComponent.material.outlineColor = this._mySetup.myTextColor;
        valueTextComponent.material.color = this._mySetup.myTextColor;
        valueTextComponent.material.outlineColor = this._mySetup.myTextOutlineColor;

        this._mySelectedShape.snapScale(this._myToolSettings.mySnapSettings.myScaleSnap);
    }

    _changeColor(index) {
        let newColor = this._mySetup.myColors[index];
        this._mySelectedShape.setColor(newColor);
    }

    _colorHover(index) {
        let material = this._myUI.myColorButtonsBackgroundComponents[index].material;
        let color = this._mySetup.myColors[index].slice(0);

        for (let i = 0; i < 3; ++i) {
            color[i] = Math.min(1, color[i] + (1 - color[i]) * 0.6);
        }

        material.color = color;
    }

    _colorUnHover(index) {
        let material = this._myUI.myColorButtonsBackgroundComponents[index].material;
        material.color = this._mySetup.myColors[index];
    }
}