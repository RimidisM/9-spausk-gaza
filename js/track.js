 // 0 - sand
        // 1 - road north/south
        // 2 - road east/west
        // 3 - right turn (top)
        // 4 - left turn (top)
        // 5 - right turn (bottom)
        // 6 - left turn (bottom)
        // 7 - start/finish
        // 8 - tree
        // 9 - additional check points

        const track = [
            [3, 2, 2, 4, 0, 3, 2, 9, 2, 4, 0, 0],
            [1, 0, 0, 6, 4, 1, 8, 0, 0, 6, 2, 4],
            [7, 3, 4, 0, 6, 5, 0, 0, 0, 0, 8, 7],
            [6, 5, 1, 0, 0, 8, 3, 2, 2, 4, 0, 1],
            [0, 8, 6, 2, 9, 2, 5, 0, 0, 6, 2, 5]
        ];

const checkpoints = [
    [0, 6],
    [2, 11],
    [4, 5],
    [2, 0]
]

let car1Checks = [
    1, 2, 3, 2, 1, 2, 3, 4, 
]