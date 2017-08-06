# MoMath Hackathon 2017: Ramsey Run

Project category: Math Square behavior Team members: David Hamberlin, Arturo Ruvalcaba, Skona Brittain

## The Math

The underlying mathematics is Ramsey Theory, which is “the mathematical study of combinatorial objects in which a certain degree of order must occur as the scale of the object becomes large” (quoted from http://mathworld.wolfram.com/RamseyTheory.html). A typical Ramsey result is that a sufficiently large structure must contain an interesting sub-structure.

A graph is a set of vertices and edges. Once every pair of points is connected, the graph is called a complete graph. In this project we are working with K<sub>5</sub> and K<sub>6</sub>, the complete graphs on 5 and 6 vertices.

If N is larger than 5, K<sub>N</sub> must contain a monochromatic subgraph K<sub>3</sub>. (K<sub>3</sub>, the complete graph on 3 vertices, is just a triangle.) This is the simplest Ramsey Theory result!

Since 6 is the minimum number of vertices that guarantees a red or blue triangle, we say that the Ramsey number R(3,3) is 6.
R(4,4) is known to be 18 but R(5,5) is *unknown* (‘though it is known to be between 43 and 49).
Thus accessible Ramsey theory is on the cutting edge of mathematics!

## The Submission

Ramsey Run is a game that allows experimentation with Ramsey Theory. It illustrates that R(3,3) = 6.

We divide MathSquare into 4 quadrants, so there can be 4 independent games being played simultaneously.
In the red & green quadrants, there are 6 points at the vertices of a regular hexagon. In the blue & yellow quadrants, there are 5 points at the vertices of a regular pentagon.

At the beginning of the game, when a child steps on a point and then on another point, a red edge is drawn between them. When they or another child then step on a 3<sup>rd</sup> and 4<sup>th</sup> point, those points are joined by a blue edge. And so on, alternating between red & blue.

When a monochromatic triangle is made, it flashes for a short while, and then that quadrant’s game is reset.

The canonical way of playing is with 2 competitors trying to *avoid* creating a triangle in their color. However it is equally valid, and we envision more likely for younger kids, that children will play trying to *make* the triangles, and, hopefully, to block their opponents from making one. They can also play alone or with more people and/or teams.

For the pentagons, it *is* possible to color all 10 edges red & blue without having a monochromatic triangle, i.e. to end in draw. For the hexagons, it is *not* possible to color all 15 edges red & blue without having a monochromatic triangle. In other words, R(3,3) = 6.

A MoMath Interpreter could ask advanced kids if they notice any difference between playing the red/green and the blue/yellow squares.
