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

export interface GroupedAsset {
  key: string
  icon: string
  title: string
  assets: ReleaseAsset[]
}

interface AssetGroupRule {
  key: string
  icon: string
  title: string
  pattern: RegExp
}

const ASSET_GROUP_RULES: AssetGroupRule[] = [
  {
    key: 'win-installer',
    icon: 'mdi:microsoft-windows',
    title: 'Windows 安装程序 (exe)',
    pattern: /^Snishaper-.*-(?:x64|x86|386|arm64)Setup\.exe$/i,
  },
  {
    key: 'win-msix-bundle',
    icon: 'mdi:package-variant-closed',
    title: 'MSIX 混合架构包',
    pattern: /^(?:dongle\..*\.7z|unsigned_.*\.msixbundle?)$/i,
  },
  {
    key: 'win-portable',
    icon: 'mdi:archive',
    title: 'Windows 便携版 (7z)',
    pattern: /^snishaper-windows-[\w-]+\.7z$/i,
  },
  {
    key: 'linux-portable',
    icon: 'mdi:linux',
    title: 'Linux 便携版 (tar.gz)',
    pattern: /^snishaper-linux-[\w-]+\.tar\.gz$/i,
  },
  {
    key: 'cli',
    icon: 'mdi:console-line',
    title: 'CLI 命令行版 (7z)',
    pattern: /^snishaper-cli-[\w-]+\.7z$/i,
  },
]

// Every architecture the release pipeline publishes shows up automatically:
// the rules match by name shape, never by a fixed architecture list, so a
// new target needs no change here.
export function groupAssets(assets: ReleaseAsset[] | undefined): GroupedAsset[] {
  if (!assets || !assets.length) return []
  const groups: GroupedAsset[] = []
  const claimed = new Set<string>()

  for (const rule of ASSET_GROUP_RULES) {
    const matched = assets.filter((a) => !claimed.has(a.name) && rule.pattern.test(a.name))
    if (!matched.length) continue
    matched.forEach((a) => claimed.add(a.name))
    groups.push({
      key: rule.key,
      icon: rule.icon,
      title: rule.title,
      assets: [...matched].sort((a, b) => a.name.localeCompare(b.name)),
    })
  }

  const rest = assets.filter((a) => !claimed.has(a.name) && !/^RELEASE_NOTES\.md$/i.test(a.name))
  if (rest.length) {
    rest.forEach((a) => claimed.add(a.name))
    groups.push({
      key: 'other',
      icon: 'mdi:file-download',
      title: '其他资源',
      assets: [...rest].sort((a, b) => a.name.localeCompare(b.name)),
    })
  }

  return groups
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
