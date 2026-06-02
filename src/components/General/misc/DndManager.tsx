import {DragDropManager, PointerActivationConstraints, PointerSensor} from '@dnd-kit/dom';

export function DndManagerdelay() {
    return new DragDropManager({
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
    })
}