class Node{
    /*
     * updater function:    takes the values and the list of inputs.
     *                      Updates the values based on the inputs.
     * 
     * inputs:  list of inputs as [parent, output] pairs. Inputs should be
     *          referenced by the updater function using the weird notation:
     *          ```inputs[inputName][0].values[inputs[inputName][1]]```
     *          Or use ``` Node.read(inputs[inputName]) ```
     * 
     * children:    Private value. list of children that will be marked
     *              for update when this gets updated and the value changes.
     * 
     * values:  list of values that the node contains. These are outputs
     *          and internal variables.
     * 
     * init function:   takes the values. Allows them to be changed, and
     *                  allows for other things to happen as needed.
     */
    constructor(init, updater){
        this.updater = updater;
        this.inputs = {};
        this.children = [];
        this.values = {};
        init(this.values);
    }
    /* 
     * This function tells this node and all of the nodes connected to its outputs to update.
     * 
     * needsUpdateList: internal call array for recursion. Do not use.
     */
    async update(needsUpdateList){
        if(needsUpdateList==undefined) needsUpdateList=[];
        let oldValue = JSON.stringify(this.values);
        this.updater(this.values, this.inputs);
        if(oldValue != JSON.stringify(this.values)) for(let child of this.children) if(needsUpdateList.indexOf(child)==-1) needsUpdateList.push(child);
        if(needsUpdateList.length) needsUpdateList.splice(0, 1)[0].update();
    }
    /*
     * This function connects two nodes.
     */
    static connect(parent, output, child, input){
        parent.children.push(child);
        child.inputs[input] = [parent, output];
    }
    /*
     * Takes an input referencer and returns the input's value.
     */
    static read(input){
        return input[0].values[input[1]];
    }

    static exampleProgram(){
        window.input1 = new Node(
            (values)=>{
                values.value = false;
                document.body.innerHTML+="<button onclick='input1.update();' id='in1'>input</button>";
            },
            (values, inputs)=>{
                values.value = !values.value;
                document.getElementById("in1").innerText = values.value;
            }
        );
        window.input2 = new Node(
            (values)=>{
                values.value = false;
                document.body.innerHTML+="<button onclick='input2.update();' id='in2'>input</button>";
            },
            (values, inputs)=>{
                values.value = !values.value;
                document.getElementById("in2").innerText = values.value;
            }
        );
        let and = new Node(
            (values)=>{
                values.value = false;
            },
            (values, inputs)=>{
                values.value = true;
                for(var input of Object.values(inputs)){
                    values.value&=Node.read(input);
                }
            }
        );
        let not = new Node(
            (values)=>{
                values.value = false;
            },
            (values, inputs)=>{
                values.value = !Node.read(inputs[0]);
            }
        );
        let output = new Node(
            (values)=>{
                values.value = false;
                document.body.innerHTML += "<p id='output'>false</p>"
            },
            (values, inputs)=>{
                values.value = Node.read(inputs[0]);
                document.getElementById('output').innerText = values.value;
            }
        );
        Node.connect(input1, "value", and, 0);
        Node.connect(input2, "value", and, 1);
        Node.connect(and, "value", not, 0);
        Node.connect(not, "value", output, 0);
    }
}