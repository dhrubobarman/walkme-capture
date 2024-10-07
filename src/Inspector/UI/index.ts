import { Inspector } from '@/Inspector';
import { CaptureUI } from '@/Inspector/UI/CaptureUI';
import { SavedStepUI } from '@/Inspector/UI/SavedStepUI';
import { indexDbName, indexDbStoreName } from '@/utils/constants';
import { IndexedDb } from '@/IndexedDb';
import { StepData } from '@/Inspector/types';

export class UI {
  inspector: Inspector;
  captureUI: CaptureUI;
  savedStepUI: SavedStepUI;
  indexedDb: IndexedDb<StepData>;
  constructor(inspector: Inspector) {
    this.inspector = inspector;
    this.indexedDb = new IndexedDb<StepData>({ storeName: indexDbStoreName, uniqueKey: '_id', dbName: indexDbName, version: 4 });
    this.captureUI = new CaptureUI(this, 'captureUI', this.handleZIndex.bind(this));
    this.savedStepUI = new SavedStepUI(this, 'savedStepUI', this.handleZIndex.bind(this));
    this.initDND();
  }
  initDND() {
    this.savedStepUI.initDND('savedStepUI', this.handleZIndex.bind(this));
    this.captureUI.initDND('captureUI', this.handleZIndex.bind(this));
  }

  handleZIndex(container: HTMLElement, name: string) {
    container.style.zIndex = '10000';
    if (name === 'captureUI') {
      this.savedStepUI.container.style.zIndex = '9999';
    } else {
      this.captureUI.container.style.zIndex = '9999';
    }
  }
}
