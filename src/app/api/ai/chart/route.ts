import { dashboardSchema } from "@/app/schemas/dashboard"
import OpenAI from "openai"
import { OAIStream, withResponseModel } from "zod-stream"

//import { RateLimiter } from "@/lib/rate-limiter"




//const oai = new OpenAI({
//	apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
//	organization: process.env["OPENAI_ORG_ID"] ?? undefined
//})




export const runtime = "edge"




//interface IRequest {
//	messages: OpenAI.ChatCompletionMessageParam[]
//}




export async function POST(
	request: Request
) {


	//const rateLimit = await RateLimiter(request)




	//if (!rateLimit || rateLimit?.isLimited) {
	//	return new Response("Daily limit exceeded", {
	//		status: 429
	//	})
	//}




	const { 
		messages, APIKey 
	} = (
		await request.json()
	) //as IRequest




	const oai = new OpenAI({
		apiKey: APIKey,
		organization: process.env["OPENAI_ORG_ID"] ?? undefined
	})



	const params = withResponseModel({
		response_model: { 
			schema: dashboardSchema, 
			name: "Metrics" 
		},
		params: {
			temperature: 0.2,
			seed: 1,
			messages: [
				{
					content:
						"you are tasked with extracting metrics from raw text - you will try to build one time series with useful and valid data - and up to 8 individual static metrics.",
					role: "system"
				},
				...messages
			],
			model: "gpt-4-1106-preview",
			stream: true
		},
		mode: "TOOLS"
	})




	const extractionStream = await oai.chat.completions.create(params)




	return new Response(
		OAIStream({
			res: extractionStream
		})
	)




}



