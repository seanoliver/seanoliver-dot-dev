import Title from '@/components/Title';
import { EXPERIENCES } from '@/lib/globals';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Experience(): JSX.Element {
	return (
		<div className='Experiences'>
			{EXPERIENCES.map((experience, index) => (
				<Card
					key={index}
					className='mb-4 rounded-md hover:transition-shadow hover:shadow-lg'>
					<CardHeader className='flex flex-row justify-between'>
						<div className='flex items-center gap-4'>
							<Avatar>
								<AvatarImage src={experience.logo} />
								<AvatarFallback>{experience.company[0]}</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle>{experience.company}</CardTitle>
								<CardDescription>{experience.title}</CardDescription>
							</div>
						</div>
						<div className='hidden md:block'>
							<Badge variant='secondary'>{experience.date}</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<CardDescription className='leading-7'>{experience.description}</CardDescription>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
