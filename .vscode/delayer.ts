// This hack is needed to give time for debugger to connect.
// Tests are running to quickly - need to give some time for breakpoints to start work
setTimeout(function() {
    console.log("5 seconds passed");
    run();
}, 5000);
