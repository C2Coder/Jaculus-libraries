import { test_from_lib_2 } from "./test-lib-2.js";
export function test1() {
    console.log("console.log from test-lib-1");
}
export function test2() {
    test_from_lib_2();
}
