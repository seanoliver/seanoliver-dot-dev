import { useState, useEffect } from 'react';
import { allPosts, type Post } from 'contentlayer/generated';
import { compareDesc, set } from 'date-fns';

export default function usePosts() {
	const [posts, setPosts] = useState<Post[]>();

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
			setPosts(posts);
		} else {
			const posts = allPosts
				.filter(post => post.isPublished)
				.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
			setPosts(posts);
		}
	});

	return posts;
}
