/* Program Description/notes:
   This program queries k8s for a list of pods in a given namespace.
   The k8s context must be set prior to invoking this program.
   See -h flag for command options.
*/
import k8s from '@kubernetes/client-node';
import { Command, Option } from 'commander';

// check for command flags
const flag: Command = new Command()
flag
  .addOption(new Option('-n --namespace <string>', 'The k8s namespace to use.').default('kube-system'))
  .addOption(new Option('-p --pagelimit <number>', 'The max number of items output per page.').default(10))
  .addOption(new Option('-t --timeout <number>', 'The max time to wait for a response.').default(10))
  .addOption(new Option('-d --debug', 'Output one page of pod objects and exit.'))
  .showHelpAfterError()
  .parse();
const namespace: string = flag.opts()['namespace']
const pagelimit: number = flag.opts()['pagelimit']
const timeout: number = flag.opts()['timeout']
const debug: boolean = flag.opts()['debug'] ? true : false

// setup k8s to use current context (set prior to calling this program)
const kubeConfig: k8s.KubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault()
const k8sApi: k8s.CoreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api)
const cluster: string = String(kubeConfig.getCurrentCluster()?.name)

// confirm input parameters (informational only)
console.info("k8s cluster = %s\nnamespace = %s\npage limit = %s\ntimeout = %s\ndebug = %s", cluster, namespace, pagelimit, timeout, debug)

// load container attributes
var nextToken: string | undefined = undefined
do {
  await k8sApi.listNamespacedPod(namespace, undefined, undefined,
    nextToken, undefined, undefined, pagelimit,
    undefined, undefined, timeout, undefined, undefined)
    .then((res) => {
      if (debug) { console.info(JSON.stringify(res.body.items, null, 2)); process.exit(0) }
      for (var pod of res.body.items) {
        console.info(String(pod.metadata?.name))
      }
      nextToken = res.body.metadata?._continue
    })
    .catch((error) => {
      if (error.hasOwnProperty('body')) { // api was reached, but has error
        console.info("k8s api returned error:", error.body.message)
      } else {                            // api could not be reached.
        console.info("k8s api not reachable:", error)
      }
      process.exit(1)
    })
    .finally(() => {
      console.info("nextToken:", nextToken)
    });
} while (nextToken != undefined)
console.info("bye")