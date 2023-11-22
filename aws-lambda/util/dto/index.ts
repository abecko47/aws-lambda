

export type Repeater = {
    action: "repeat" | "log",
    payload: {
        printer: "printer1" | "printer3",
        sensor: "diameter" | "length",
        value: number,
    }
}

// This wouldnt be needed with proper decorators, ORM, etc, this is not scalable
export const isRepeaterObject = (o: object) => {
    if ("action" in o && "payload" in o) {
        if ((o.action === "repeat" || o.action === "log")) {
            const payload = o.payload as object;
            if ("printer" in payload && "sensor" in payload && "value" in payload) {
                if ((payload.printer === "printer1" || payload.printer === "printer3") && (payload.sensor === "diameter" || payload.sensor === "length") && typeof payload.value === "number")
                return true;
            }
        }
    }

    return false;
}
