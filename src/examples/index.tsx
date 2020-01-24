import {
    Card as CardBase,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@material-ui/core'
import { styled } from '@storybook/theming'
import React, { ReactNode } from 'react'

const StyledCard = styled(CardBase)`
    width: 240px;
    display: inline-block;
    margin: 10px;
`

const StyledMedia = styled(CardMedia)`
    height: 0;
    padding-top: 56.25%;
`

export interface CardProps {
    title: string
    subhead?: string
    image?: string
    children: ReactNode
}

export const Card = ({ title, subhead, image, children }: CardProps) => {
    return (
        <StyledCard>
            <CardHeader title={title} subheader={subhead} />
            {image && <StyledMedia image={image} />}
            <CardContent>{children}</CardContent>
        </StyledCard>
    )
}

export interface ArtworkProps {
    title: string
    imageUrl: string
    artist: {
        name: string
        location: string
    }
}

export const Artwork = ({ title, imageUrl, artist }: ArtworkProps) => {
    return (
        <Card title={title} image={imageUrl}>
            <Typography variant="subtitle1">{artist.name}</Typography>
            <Typography variant="body2">{artist.location}</Typography>
        </Card>
    )
}

export interface UserProps {
    id: number
    name: string
    email: string
    website: string
    company: {
        name: string
    }
}

export const User = ({ id, name, email, website, company }: UserProps) => (
    <Card
        title={name}
        subhead={company.name}
        image={`https://placeimg.com/240/135/people?${id}`}
    >
        <Typography variant="subtitle1">{email}</Typography>
        <Typography variant="body2">{website}</Typography>
    </Card>
)
