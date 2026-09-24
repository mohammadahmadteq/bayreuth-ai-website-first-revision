/* Card dimensions in world units — portrait ID-badge proportions */
export const CARD_WIDTH = 2.6
export const CARD_HEIGHT = 3.7
export const CARD_RADIUS = 0.16
export const CARD_DEPTH = 0.1

/* Lanyard strap: world-unit run from the fixed top anchor to the card's top edge */
export const STRAP_LENGTH = 1.0
export const STRAP_WIDTH = 0.2
export const STRAP_SEGMENTS = 20
export const TOTAL_HEIGHT = CARD_HEIGHT + STRAP_LENGTH
export const ANCHOR_Y = TOTAL_HEIGHT / 2
export const REST_Y = -STRAP_LENGTH / 2

/*
 * The canvas extends past the layout box by this factor so a dragged card
 * isn't clipped at the box edge. It is pointer-events: none (input arrives
 * via window listeners), so the overhang never blocks surrounding UI.
 */
export const OVERSCAN = 1.24
export const DRAG_LIMIT = 0.9
export const DRAG_HARD_LIMIT = 1.1

/* A pointer that moves less than this and releases quickly counts as a click, not a drag */
export const CLICK_MOVE_THRESHOLD_PX = 6
export const CLICK_TIME_THRESHOLD_MS = 350
