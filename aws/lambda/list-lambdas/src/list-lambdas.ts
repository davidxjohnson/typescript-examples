//*--
// Uses a paginator to itterate over pages returned by the Lambda SDK
// current AWS context assumed to be set prior to invocation 
//--*
import type { Paginator } from '@aws-sdk/types'
import {
    LambdaClient, paginateListFunctions, LambdaPaginationConfiguration,
    ListFunctionsCommandInput, ListFunctionsCommandOutput
} from "@aws-sdk/client-lambda"
import { Command } from 'commander'

// check for command flags
const flags: Command = new Command()
flags
    .option('-r --region   <string>', 'The aws region name to use. (required)', 'us-east-1')
    .option('-p --pagesize <number>', 'Number of items per page.', '50')
    .showHelpAfterError()
    .parse()
const pageSize: number = flags.opts()['pagesize']
const defaultRegion: string = flags.opts()['region']

// setup sdk-lambda client and its paginator
const clientInput: ListFunctionsCommandInput = {} //FunctionVersion: 'ALL', MasterRegion: defaultRegion }
const lambdaClient: LambdaClient = new LambdaClient({ region: defaultRegion })
const paginatorConfig: LambdaPaginationConfiguration = { client: lambdaClient, pageSize: pageSize } //, stopOnSameToken: false }
const paginator: Paginator<ListFunctionsCommandOutput> = paginateListFunctions(paginatorConfig, clientInput)

// using the nice features of SDK V3 to get a list of lambda names
process.stdout.write('processing')
const funcList: string[] = []; // populate some useful object, depending on what data you want

try {
    for await (const page of paginator) { // itterate through pages
        // the ! after the 'Functions' object tells the compiler to 'just trust me' ...
        // the object will never be null or undefined.
        for (const func of page.Functions!) { // itterate through functions in the current page
            funcList.push(func.FunctionName!)
            // console.info(func)
        }
        process.stdout.write('.') // crawling dots on stdout for each page processed
    }
    process.stdout.write('\n')
} catch (error) {
    lambdaClient.destroy()
    console.error('\n', error)
    process.exit(1)
} finally {
    lambdaClient.destroy()
    console.info(funcList) // do something useful with the populated object.
}
console.info('success!')
