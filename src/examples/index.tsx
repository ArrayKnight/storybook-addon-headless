import {
    Card as CardBase,
    CardContent,
    CardHeader,
    CardMedia,
    CircularProgress,
    Modal,
    Paper,
    Typography,
} from '@material-ui/core'
import { styled } from '@storybook/theming'
import React, { ReactElement, ReactNode } from 'react'

const StyledModal = styled(Modal)``

const StyledPaper = styled(Paper)`
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
`

export const Loader = (): ReactElement => (
    <StyledModal
        open={true}
        disableAutoFocus={true}
        disableBackdropClick={true}
    >
        <StyledPaper elevation={5} square={true}>
            <CircularProgress />
        </StyledPaper>
    </StyledModal>
)

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

export const Card = ({
    title,
    subhead,
    image,
    children,
}: CardProps): ReactElement => (
    <StyledCard>
        <CardHeader title={title} subheader={subhead} />
        {image && <StyledMedia image={image} />}
        <CardContent>{children}</CardContent>
    </StyledCard>
)

export interface ArtworkProps {
    title: string
    imageUrl: string
    artist: {
        name: string
        location: string
    }
}

export const Artwork = ({
    title,
    imageUrl,
    artist,
}: ArtworkProps): ReactElement => (
    <Card title={title} image={imageUrl}>
        <Typography variant="subtitle1">{artist.name}</Typography>
        <Typography variant="body2">{artist.location}</Typography>
    </Card>
)

export interface ShowProps {
    name: string
    description: string
    cover_image: {
        image_versions: string[]
        image_url: string
    }
}

export const Show = ({
    name,
    description,
    cover_image: { image_versions, image_url },
}: ShowProps): ReactElement => (
    <Card title={name} image={image_url.replace(/:version/, image_versions[0])}>
        <Typography variant="subtitle1">{description}</Typography>
    </Card>
)

export interface UserProps {
    id: number
    name: string
    email: string
    website: string
    company: {
        name: string
    }
}

export const User = ({
    id,
    name,
    email,
    website,
    company,
}: UserProps): ReactElement => (
    <Card
        title={name}
        subhead={company.name}
        image={`https://placeimg.com/240/135/people?${id}`}
    >
        <Typography variant="subtitle1">{email}</Typography>
        <Typography variant="body2">{website}</Typography>
    </Card>
)
