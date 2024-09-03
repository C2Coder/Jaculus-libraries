import { stdout } from "stdio";
import { readline } from "./libs/readline.js";
//* řetězce
async function echo() {
    stdout.write("Napiš nějaký text a stiskni enter.\n");
    const reader = new readline(false); // vytvoří novou instanci třídy readline
    while (true) { // opakuje se donekonečna
        const line = await reader.read(); // přečte řádek z konzole
        stdout.write("Zadal jsi: " + line + "\n"); // vypíše řádek na konzoli
        stdout.write(`Druhá možnost výpisu: Zadal jsi: ${line}\n`); // vypíše řádek na konzoli
        if (line == "konec") { // pokud je řádek roven "konec"
            stdout.write("Ukončuji.\n"); // vypíše text na konzoli
            break; // ukončí cyklus
        }
    }
    reader.close(); // ukončí čtení z konzole
}
echo(); // zavolá funkci echo
