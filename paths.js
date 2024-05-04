import path from 'path'

const paths = {
	clientBuildDirectory: path.join('client', 'dist'),
	imagesDirectory: 'images',
	postsFile: 'posts.json',
}

paths.clientIndexFile = path.join(paths.clientBuildDirectory, 'index.html')

export default paths
