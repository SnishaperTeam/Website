import { ref, onMounted, type Ref } from 'vue'

export interface ReleaseAsset {
  name: string
  size: number
  downloadCount: number
  browserDownloadUrl: string
}

export interface Release {
  tagName: string
  name: string | null
  publishedAt: string | null
  body: string | null
  htmlUrl: string
  prerelease: boolean
  draft: boolean
  zipballUrl: string | null
  tarballUrl: string | null
  assets: ReleaseAsset[]
}

export interface GithubReleaseState {
  release: Ref<Release | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchRelease: () => Promise<void>
}

export function useGithubRelease(repo: string, workerBase: string): GithubReleaseState {
  const release = ref<Release | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchRelease = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${workerBase}/api/latest?repo=${encodeURIComponent(repo)}`, {
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      release.value = json.data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchRelease)

  return { release, loading, error, fetchRelease }
}

export interface GithubReleasesState {
  releases: Ref<Release[] | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchReleases: () => Promise<void>
}

export function useGithubReleases(repo: string, workerBase: string, limit = 8): GithubReleasesState {
  const releases = ref<Release[] | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchReleases = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${workerBase}/api/releases?repo=${encodeURIComponent(repo)}&limit=${limit}`, {
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      releases.value = json.data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchReleases)

  return { releases, loading, error, fetchReleases }
}

export interface RepoMeta {
  stars: number
  forks: number
  openIssues: number
  license: string | null
  description: string | null
  htmlUrl: string
}

export interface GithubRepoState {
  repoMeta: Ref<RepoMeta | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchRepoMeta: () => Promise<void>
}

export function useGithubRepo(repo: string, workerBase: string): GithubRepoState {
  const repoMeta = ref<RepoMeta | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchRepoMeta = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${workerBase}/api/repo?repo=${encodeURIComponent(repo)}`, {
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      repoMeta.value = json.data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchRepoMeta)

  return { repoMeta, loading, error, fetchRepoMeta }
}

export function officialReleases(releases: Release[] | null, count = 3): Release[] {
  if (!releases) return []
  return releases.filter((r) => !r.prerelease && !r.draft).slice(0, count)
}

export function versionNumber(tagName: string | null | undefined): string {
  if (!tagName) return ''
  return tagName.replace(/^v/i, '')
}

export function ghProxyUrl(url: string): string {
  return `https://v6.gh-proxy.org/${url}`
}

export function findAsset(release: Release | null, pattern: RegExp): ReleaseAsset | null {
  if (!release || !release.assets.length) return null
  return release.assets.find((a) => pattern.test(a.name)) || null
}

export function formatSize(bytes: number | undefined): string {
  if (!bytes) return ''
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
