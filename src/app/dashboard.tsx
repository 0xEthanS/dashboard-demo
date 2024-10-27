"use client"

import { useState } from "react"
import { useJsonStream } from "stream-hooks"
import { Overview } from "@/components/overview"
import { Button } from "@/components/ui/button"
import { 
	Card, 
	CardContent, 
	CardHeader, 
	CardTitle 
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { dashboardSchema } from "@/app/schemas/dashboard"
import { treasury } from "@/app/text"








export function Dashboard() {


	const [submitted, setSubmitted] = useState(false)

	const [prompt, setPrompt] = useState(treasury)

	const [openAIAPIKey, setOpenAIAPIKey] = useState('')




	const { 
		data, 
		loading, 
		startStream 
	} = useJsonStream(
		{
			schema: dashboardSchema
		}
	)




	const submitMessage = async () => {
		try {
			setSubmitted(true)
			await startStream({
				url: "/api/ai/chart",
				method: "POST",
				body: {
					messages: [
						{
							content: prompt,
							role: "user"
						}
					],
					APIKey: openAIAPIKey
				}
			})
		} catch (e) {
			console.error(e)
		}
	}




	const handlePromptChange = (e) => {
		setPrompt(e.target.value)
	}




	const handleOpenAIAPIKeyChange = (e) => {
		setOpenAIAPIKey(e.target.value)
	}




	return !submitted ? (


		<>
			<div>
				<Textarea 
					className="mb-12 min-h-[50vh] w-full" 
					value={prompt} 
					onChange={handlePromptChange}
				/>
				<h1 className="mb-2">
					OpenAI API Key:
				</h1>
				<Textarea 
					className="mb-12 w-full" 
					placeholder="OpenAI API Key"
					value={openAIAPIKey} 
					onChange={handleOpenAIAPIKeyChange}
				/>
				<Button 
					onClick={submitMessage}
				>
					Generate report
				</Button>
			</div>
		</>


	) : (


		<>


			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{data?.big_metrics?.map(i => (
					<Card key={i.name}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{i.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{i.value}
							</div>
							<p className="text-xs text-muted-foreground">
								{i.secondary_value}
							</p>
						</CardContent>
					</Card>
				))}
			</div>


			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>
							{data?.timeSeriesChartName ?? ""}
						</CardTitle>
					</CardHeader>
					<CardContent className="pl-2">
						<Overview data={data?.timeSeries ?? []} />
					</CardContent>
				</Card>
			</div>


		</>


	)
}



