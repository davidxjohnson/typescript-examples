## How to use these code examples:

### Prerequisits:

* Access to a K8S cluster (MiniKube, EKS, OpenShift etc). 
* The k8s context must be set prior to running the example code. See [`KUBECONFIG` env variable or .kube/config file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
* Install [typescript](https://www.typescriptlang.org/download)
* [kubectl](https://kubernetes.io/docs/tasks/tools/) is helpful, but not required to run the examples. 

### Running the example:

* Clone this repo to your local working environment.
* cd to any example folder that contains a `tsconfig.json` file. 
* install the needed modules with `npm install`
* "compile" the project using the `tsc` command.
* run the example by executing node. Example: `node js/list-pods.js`