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
  .addOption(new Option('-d --dump', 'Output all content of pod objects.').default(false))
  .showHelpAfterError()
  .parse();
const namespace: string = flag.opts()['namespace']
const pagelimit: number = flag.opts()['pagelimit']
const timeout: number = flag.opts()['timeout']
const dump: boolean = flag.opts()['dump']

// setup k8s to use current context (set prior to calling this program)
const kubeConfig: k8s.KubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault()
const k8sApi: k8s.CoreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api)
const cluster: string = String(kubeConfig.getCurrentCluster()?.name)

// confirm input parameters (informational only)
console.info("k8s cluster = %s\nnamespace = %s\npage limit = %s\ntimeout = %s\ndump = %s", cluster, namespace, pagelimit, timeout, dump)

// fetch container names (or other attributes) using pagination
var nextToken: string | undefined = undefined
do {
  await k8sApi.listNamespacedPod(namespace, undefined, undefined,
    nextToken, undefined, undefined, pagelimit,
    undefined, undefined, timeout, undefined, undefined)
    .then((res) => {
      if (dump) {
        console.info(JSON.stringify(res.body?.items, null, 2))
      } else {
        for (var pod of res.body.items as k8s.V1Pod[]) {
          console.info(String(pod.metadata?.name))
        }
      }
      nextToken = res.body.metadata?._continue
    })
    .catch((error) => {
      if (error.hasOwnProperty('body')) { // api was reached, but has error
        console.error("k8s api returned error:", error.body.message)
      } else {                            // api could not be reached.
        console.error("k8s api not reachable:", error)
      }
    })
    .finally(() => {
      console.info("nextToken:", nextToken)
    });
} while (nextToken != undefined)
console.info("bye")