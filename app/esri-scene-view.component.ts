import { Component, ElementRef, Output, EventEmitter } from 'angular2/core';
import { MapService } from './map.service';
import { ViewCoordinationService } from './view-coordination.service';
import { Map, SceneView } from 'esri-mods';

@Component({
    selector: 'esri-scene-view',
    template: '<div></div>',
    providers: [MapService]
})
export class EsriSceneViewComponent {
    @Output() viewCreated = new EventEmitter();

    view: null;

    constructor(
        private _mapService: MapService,
        private _viewCoordinationService: ViewCoordinationService,
        private elRef: ElementRef
    ) {}

    ngOnInit() {
        this.view = new SceneView({
            container: this.elRef.nativeElement.firstChild,
            map: this._mapService.map,
            zoom: this._viewCoordinationService.zoom,
            center: this._viewCoordinationService.center,
            rotation: this._viewCoordinationService.rotation
        })

        this.view.then(function(view) {
            this.viewCreated.next(view);
        }.bind(this));

        this.view.watch('camera', function(newVal, oldVal, propertyName) {
            this._viewCoordinationService.setValue(newVal, propertyName);
        }.bind(this));

    }

    syncCamera() {
        this.view.animateTo(this._viewCoordinationService.camera, {
            delay: 300
        });
        // this.view.camera = this._viewCoordinationService.camera;
    }
}
