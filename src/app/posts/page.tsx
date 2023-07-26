'use client';

import { compareDesc } from 'date-fns';
import { allPosts, Post } from 'contentlayer/generated';
import usePosts from '@/hooks/use-posts';
import Section from '@/components/Section';
import PostList from '@/components/post-list';

export default function Posts() {
	const posts = usePosts();

	return (
		<>
			{posts && posts.length > 0 && (
				<Section title='Latest Posts'>
					<PostList posts={posts} limit={3} />
				</Section>
			)}
		</>
	);
}