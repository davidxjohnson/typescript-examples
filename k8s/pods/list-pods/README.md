# list-pods.ts

### Description
An example that uses the [@kubernetes/client-node](https://github.com/kubernetes-client/javascript) module to fetch a list of pod names and output them to the console. Many other attributes can be fetched as well (use the -d flag to explore them). 

### What is noteworthy about this example?
* In an effort to keep the code "strict" TypeScript, the type of all the variables are either declare or annotated. 

* The K8S SDK for Javascript is pretty light on [TypeScript examples](https://github.com/kubernetes-client/javascript/blob/master/examples/typescript/simple/example.ts) and very few examples include pagination. Although the default page limit is high, the k8s function `listNamespacedPod` has an upper page limit that can be a factor with verly large k8s clusters. The best practice is to take advantage of pagination.

* Note the [await](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#module-es2022) in line 35 of [list-pods.ts](./src/list-pods.ts). This is a new feature supported by module es2022, which is sourced in line 2 of the [tsconfig.json](./tsconfig.json) configuration file (see [@tsconfig/node16-strictest-esm](https://github.com/tsconfig/bases/blob/main/bases/node16-strictest-esm.combined.json)). Without `await`, the do/while loop would exit its block before all the data was delivered by the synchronous `listNamespacedPod` function.

* The k8s SDK includes types, which makes it easier to explore type properties in VSCode. For example, try replacing `pod.metadata?.name` (line 42) with `pod.spec.` and watch VSCode provide code hints (sweet!).  
### Sample run:

**Reminder:** Set your k8s context prior to running this example.

```
$ npm install
$ tsc
$ node js/list-pods.js

k8s cluster = arn:aws:eks:us-east-1:3287010598:cluster/mycluster
namespace = kube-system
page limit = 10
timeout = 10
debug = false
aws-load-balancer-controller-848c845c65-4kjmx
aws-node-2mq29
aws-node-47ct8
aws-node-4cdkx
aws-node-5cd5x
aws-node-5hvr5
aws-node-5pvlf
aws-node-5vwzc
aws-node-887n6
aws-node-8nwfg
nextToken: eCJydiI6MTExMjEwNTgzMiwic3RhcnQiOiJhd3Mtbm9kZS04bndmZ1x1MDAwMCJ9
aws-node-8zxjq
aws-node-9b52k
aws-node-9dpvl
...
bye !
```

If you want to explore the properties of a pod object, use the `-d` flag:

```
node js/list-pods.js -p 1 -d
```
