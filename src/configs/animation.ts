export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'bounce',
    children: [
      { name: 'bounces', value: 'bounceIn' },
      { name: 'To the right to intervene', value: 'bounceInLeft' },
      { name: 'To the left into', value: 'bounceInRight' },
      { name: 'Bounces up', value: 'bounceInUp' },
      { name: 'Down into', value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: 'emerging',
    children: [
      { name: 'Float into the', value: 'fadeIn' },
      { name: 'To lower the', value: 'fadeInDown' },
      { name: 'Long distance downward float', value: 'fadeInDownBig' },
      { name: 'Float to the right', value: 'fadeInLeft' },
      { name: 'Long distance to float to the right', value: 'fadeInLeftBig' },
      { name: 'The left float into the', value: 'fadeInRight' },
      { name: 'Long distance left floating', value: 'fadeInRightBig' },
      { name: 'To rise into the', value: 'fadeInUp' },
      { name: 'Long distance to float upwards', value: 'fadeInUpBig' },
      { name: 'From left to rise', value: 'fadeInTopLeft' },
      { name: 'From floating into the right', value: 'fadeInTopRight' },
      { name: 'From the left down', value: 'fadeInBottomLeft' },
      { name: 'From right down into the', value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'rotating',
    children: [
      { name: 'Rotate into the', value: 'rotateIn' },
      { name: 'Around the lower left to enter', value: 'rotateInDownLeft' },
      { name: 'Around the lower right to enter', value: 'rotateInDownRight' },
      { name: 'Around the upper left to enter', value: 'rotateInUpLeft' },
      { name: 'Around the right to enter', value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'The zoom',
    children: [
      { name: 'Zoom into the', value: 'zoomIn' },
      { name: 'Zoom into the down', value: 'zoomInDown' },
      { name: 'From left zoom in', value: 'zoomInLeft' },
      { name: 'From the zoom into the right', value: 'zoomInRight' },
      { name: 'Zoom into the upward', value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Slide into',
    children: [
      { name: 'Slide down', value: 'slideInDown' },
      { name: 'From right into', value: 'slideInLeft' },
      { name: 'From the left into the', value: 'slideInRight' },
      { name: 'Slip up', value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: 'flip',
    children: [
      { name: 'X axis turning into', value: 'flipInX' },
      { name: 'Y turn into', value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: 'Zoom into',
    children: [
      { name: 'Zoom down into', value: 'backInDown' },
      { name: 'From the left slide', value: 'backInLeft' },
      { name: 'From right slide', value: 'backInRight' },
      { name: 'Amplification up into', value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Fly into',
    children: [
      { name: 'From right into', value: 'lightSpeedInRight' },
      { name: 'From the left into the', value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'bounce',
    children: [
      { name: 'The pop-up', value: 'bounceOut' },
      { name: 'Left the pop-up', value: 'bounceOutLeft' },
      { name: 'Pop up to the right', value: 'bounceOutRight' },
      { name: 'Pop up', value: 'bounceOutUp' },
      { name: 'Pop down', value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: 'emerging',
    children: [
      { name: 'to', value: 'fadeOut' },
      { name: 'Come down', value: 'fadeOutDown' },
      { name: 'Down the long distance to', value: 'fadeOutDownBig' },
      { name: 'To the left to', value: 'fadeOutLeft' },
      { name: 'Surfaced as the long distance to the left', value: 'fadeOutLeftBig' },
      { name: 'Come to the right', value: 'fadeOutRight' },
      { name: 'Surfaced as the long distance to the right', value: 'fadeOutRightBig' },
      { name: 'Up to', value: 'fadeOutUp' },
      { name: 'Long distance up to', value: 'fadeOutUpBig' },
      { name: 'From top left to', value: 'fadeOutTopLeft' },
      { name: 'Emerge from the upper right', value: 'fadeOutTopRight' },
      { name: 'From the lower left to', value: 'fadeOutBottomLeft' },
      { name: 'Emerge from the lower right', value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'rotating',
    children: [
      { name: 'Spin out', value: 'rotateOut' },
      { name: 'Around the lower left out', value: 'rotateOutDownLeft' },
      { name: 'Round exit at the lower right', value: 'rotateOutDownRight' },
      { name: 'Around the upper left out', value: 'rotateOutUpLeft' },
      { name: 'Around the upper right out', value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'The zoom',
    children: [
      { name: 'Narrowing the exit', value: 'zoomOut' },
      { name: 'down narrow exit', value: 'zoomOutDown' },
      { name: 'From the left to reduce the exit', value: 'zoomOutLeft' },
      { name: 'Narrow from the right exit', value: 'zoomOutRight' },
      { name: 'Narrow exit upward', value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Sliding out',
    children: [
      { name: 'To fall out of the', value: 'slideOutDown' },
      { name: 'From the left sliding out', value: 'slideOutLeft' },
      { name: 'From sliding out right', value: 'slideOutRight' },
      { name: 'Slip up', value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: 'flip',
    children: [
      { name: 'The X axis flip out', value: 'flipOutX' },
      { name: 'Y flip out', value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: 'To reduce the sliding out',
    children: [
      { name: 'Narrow down sliding out', value: 'backOutDown' },
      { name: 'From the left to reduce the sliding out', value: 'backOutLeft' },
      { name: 'From right to reduce the sliding out', value: 'backOutRight' },
      { name: 'To reduce the sliding out upwards', value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Fly out',
    children: [
      { name: 'From the right', value: 'lightSpeedOutRight' },
      { name: 'From the ZuoFei ', value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'The shaking',
    children: [
      { name: 'swung', value: 'shakeX' },
      { name: 'Shake up and down', value: 'shakeY' },
      { name: 'Shake your head', value: 'headShake' },
      { name: 'swing', value: 'swing' },
      { name: 'The shaking', value: 'wobble' },
      { name: 'panic', value: 'tada' },
      { name: 'jelly', value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: 'other',
    children: [
      { name: 'bounce', value: 'bounce' },
      { name: 'flashing', value: 'flash' },
      { name: 'The pulse', value: 'pulse' },
      { name: 'A rubber band', value: 'rubberBand' },
      { name: '(fast heartbeat）', value: 'heartBeat' },
    ],
  },
]