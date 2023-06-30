import Title from "@/components/Title";
import { Card, CardDescription, CardSubtitle, CardTitle } from "@/components/cards";
import { EXPERIENCES } from "@/lib/globals";

export default function Experiences(): JSX.Element {
    return (
        <div className='Experiences flex flex-col items-center justify-center w-full'>
            <Title title='Work Experience' titleSize='medium' />
            {EXPERIENCES.map((experience, index) => (
                <Card key={index}>
                    <CardTitle>{experience.company}</CardTitle>
                    <CardSubtitle>{experience.title}</CardSubtitle>
                    <CardDescription>{experience.description}</CardDescription>
                </Card>
            ))}
        </div>
    )
}