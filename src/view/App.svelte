
<style>

line.axis
{
    stroke: #cecece;
    stroke-width: 1;
    stroke-dasharray: 4;
}

circle
{
    fill: white;
    stroke: black;
}

circle:hover
{
    fill: grey;
}

circle.selected
{
    fill: black;
}

circle.selected:hover
{
    fill: black;
}

</style>

<script>

import { interpret } from "xstate";
import { toggleMachine } from "./../state/machine";

let svg;

let current = {};
let context = {};

let radius = 5;
let radiusInput = null;

const toggleService = interpret(toggleMachine)
  .onTransition(state => {
    current = JSON.parse(JSON.stringify(state));
    context = JSON.parse(JSON.stringify(state)).context
    console.log(context, current.value, current)
    //console.log(current.context) // granular context state 
    //console.log(current.value) // current state
  })
  .start();

const clickHandler = (event) => 
{
    let bound = svg.getBoundingClientRect();
    // console.log(event.clientX, bound.left, svg.clientLeft)
    let x = (event.clientX - bound.left - svg.clientLeft) * (200 / 500) - 100; // -paddingleft
    let y = (event.clientY - bound.top - svg.clientTop) * (200 / 500) - 100; // -paddingtop
  
  toggleService.send({ type: 'LOL', x: x, y: y, count: Math.random() });
} 
  
/*

STATES: 
    - idle
    - editing

EVENTS: 
    - ADD_CIRCLE { x, y }
    - EDIT { circleIndex}
    - CHANGE_CIRCLE_RADIUS { radius }
    
*/

</script>

<main>
    <svg 
        bind:this={svg}
        on:click={clickHandler} 
        width="500" height="500" 
        viewBox="-100 -100 200 200"
    >
        <g>
            <line x1="0" y1="-100" x2="0" y2="100" class="axis"></line>
            <line x1="-100" y1="0" x2="100" y2="0" class="axis"></line>
        </g>

        {#each context.circles as circle, circleIndex}
            <circle 
                on:click={() => toggleService.send('EDIT', { selectedCircleIndex: circleIndex})}
                cx="{circle.x}" cy="{circle.y}" r="{circle.radius}"
                class={() => (circleIndex === context.selectedCircleIndex) ? 'selected' : ''}
            ></circle>
        {/each}
    </svg>

    <br>

    {#if current.value === 'editing'}
        Radius: {radius} <br><input bind:this="{radiusInput}" type="range" min="1" max="50" bind:value={radius}>
        <button 
            on:click={() => { console.log(radiusInput); toggleService.send('CHANGE_CIRCLE_RADIUS', { radius: radiusInput.value })} }
        >Accept</button>
    {/if}











    <br>

    count: {context.count}
    
    <br>

    context: {JSON.stringify(context)}
</main>
