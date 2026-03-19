import {PointerSensor, PointerActivationConstraints, DragDropManager} from '@dnd-kit/dom';

export function DndManagerdelay() {
    const manager = new DragDropManager({
        sensors: [
            PointerSensor.configure({
                activationConstraints: [
                    new PointerActivationConstraints.Delay({
                        value: 150,
                        tolerance: {x: 5, y: 5},
                    }),
                ]
            })
        ]
    });
    return manager
}