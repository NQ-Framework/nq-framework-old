interface DiagramBase {
    id: string;
}
export interface DiagramNode extends DiagramBase {
    data: { label: string };
    type?: "input" | "output";
    position: { x: number, y: number }
    style?: any
};
export interface DiagramLink extends DiagramBase {
    source: string,
    target: string,
    animated: boolean
    arrowHeadType: 'arrow' | 'arrowclosed'
}
export type DiagramElement = DiagramLink | DiagramNode;