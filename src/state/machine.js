import { createMachine, assign } from 'xstate';

// This machine is completely decoupled from Svelte
export const toggleMachine = createMachine({
  id: 'toggle',
  context: {
    circles: [{ x: 10, y: 20, radius: 5 }],
    selectedCircleIndex: 0, //-1,
    count: 0
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        "LOL": {  
          target: 'idle',
          actions: [assign((context, event) => {
            console.log('ADD!!!', context.count, event.count)
            console.log(`x:${event.x}, y:${event.y}`)

            const newCircle = {
              x: event.x,
              y: event.y,
              radius: 5
            }

            context.circles = [...context.circles, newCircle]

            return {
              count: context.count + 1
            }
          })]
        },
        "EDIT": {
          target: 'editing',
          actions: [assign((context, event) => {
            console.log('from idle to editing. INDEX', event.selectedCircleIndex)
            return {
              selectedCircleIndex: event.selectedCircleIndex
            }
          })]
        }
      },      
    },
    editing: {
      on: {
        CHANGE_CIRCLE_RADIUS: {
          target: 'idle',
          actions: [assign((context, event) => {
            console.log('circle radius !!!', context.count, event.radius)
            console.log('context cifrcle', context.circles)

            context.circles[context.selectedCircleIndex].radius = event.radius

            return {
              circles: context.circles
            }
          })]
        },
        EDIT: {
          target: 'editing',
          actions: [assign((context, event) => {
            console.log('EDIT EDIT EDIT!!', context.count, event.count)
            return {
              count: context.count + 3
            }
          })]
        }
      },
    }
  }
});