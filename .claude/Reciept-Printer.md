# How to connect Printer of my family business

```
import { printer as ThermalPrinter, types as PrinterTypes, characterSet } from "node-thermal-printer"
let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: 'tcp://192.168.1.181',

    })

    try {
            let execute = await printer.execute()
            responseDBJson(res, 200, {result:"print done"})
        } catch (e){
            responseErrorJson(res, 200, "print fail")
        }
```

before implement anything about receipt printer read from doc node-thermal-printer-doc.md

192.168.1.181 this is ip of my printer
