export type Repeater = {
    action: "repeat" | "log",
    payload: {
        printer: "printer1" | "printer3",
        sensor: "diameter" | "length",
        value: number,
    }
}