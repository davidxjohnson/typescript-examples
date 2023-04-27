## How to use these code examples:

### Prerequisits:

* Access to a k8s cluster (MiniKube, EKS, OpenShift etc). 
* The k8s context must be set prior to running . See [`KUBECONFIG` env variable or .kube/config file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).
* Install [node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (node v16, npm v9+).
* Install [typescript](https://www.typescriptlang.org/download) (tsc 5.0).

### Running the example:

* Clone this repo to your local working environment.
* cd to any example folder that contains a `tsconfig.json` file. 
* install the needed modules with `npm install`
* "compile" the project using the `tsc` command.
* run the example by executing node. Example: `node js/list-pods.js`