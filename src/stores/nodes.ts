import { defineStore } from 'pinia'
import { NodeRepository, EdgeRepository } from '@/database/node'
// import type { Node, Edge } from '@vue-flow/core'
import { convertToNode, convertToEdge } from '@/shared/const/form-structure'

const useNodeStore = defineStore({
  id: 'nodes',
  state: () => {
    return {
      nodes: [] as FocusTree.NodeWithId[], //FocusTree.NodeWithId[],
      edges: [] as FocusTree.EdgeWithId[] //FocusTree.EdgeWithId[]
    }
  },
  getters: {
    async getId(): Promise<number> {
      const sNodes = localStorage.getItem('nodes')
      if (sNodes) return JSON.parse(sNodes).length
      return 0
      // return await NodeRepository.getCount() ?? 0
    },
  },
  // comment if DB ever works
  actions: {
    fetch() {
      const sNodes = localStorage.getItem('nodes')
      const sEdges = localStorage.getItem('edges')
      if (sNodes) {
        this.nodes = JSON.parse(sNodes).map((node: any) => ({
          id: node.id,
          type: node.type,
          data: node.data,
          computedPosition: node.computedPosition,
        }))
        this.nodes = JSON.parse(sNodes)
      }
      if (sEdges) this.edges = JSON.parse(sEdges)
    },
    save() {
      const simpNodes = this.nodes.map((node: any) => ({
        id: node.id,
        type: node.type,
        data: node.data,
        computedPosition: node.computedPosition,
      }))
      const simpEdges = this.edges.map((edge: any) => ({
        id: edge.id,
        type: edge.type,
        source: edge.source,
        target: edge.target,
        label: edge.label
      }))
      localStorage.setItem('nodes', JSON.stringify(simpNodes))
      localStorage.setItem('edges', JSON.stringify(simpEdges))
    },
  },

  // cant deal with the DB
  // actions: {
  //   async findAllNodes(): Promise<FocusTree.NodeWithId[]> {
  //     this.nodes = await NodeRepository.findAll()
  //     return this.nodes.map((node) => ({
  //       id: node.id,
  //       type: node.type,
  //       data: node.data,
  //       position: node.position
  //     }))
  //   },
  //   async findOneNode(id: string): Promise<FocusTree.NodeWithId> {
  //     const node = await NodeRepository.findById(id)
  //     return {
  //       id: node.id,
  //       type: node.type,
  //       data: node.data,
  //       position: node.position
  //     }
  //   },
  //   // TODO: Map correctly
  //   async importAllNodes(nodes: FocusTree.NodeWithId[]) {
  //     const promises = nodes.map((e) => NodeRepository.create(e))
  //     return await Promise.all(promises)
  //   },
  //   async createNode(node: FocusTree.NodeWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.create(node)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async updateNode(node: FocusTree.NodeWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.update(node.id, node)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async removeNode(node: FocusTree.NodeWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.remove(node.id)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async purgeNodes(): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.purge()
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   // edges
  //   async findAllEdges(): Promise<FocusTree.EdgeWithId[]> {
  //     this.edges = await EdgeRepository.findAll()
  //     return this.edges.map((edge) => ({
  //       id: edge.id,
  //       type: edge.type,
  //       source: edge.source,
  //       target: edge.target,
  //       label: edge.label
  //     }))
  //   },
  //   async findOneEdge(id: string): Promise<FocusTree.EdgeWithId> {
  //     const edge = await EdgeRepository.findById(id)
  //     return {
  //       id: edge.id,
  //       type: edge.type,
  //       source: edge.source,
  //       target: edge.target,
  //       label: edge.label
  //     }
  //   },
  //   async importAllEdges(edges: FocusTree.EdgeWithId[]) {
  //     const promises = edges.map((e) => EdgeRepository.create(e))
  //     return await Promise.all(promises)
  //   },
  //   async createEdge(edge: FocusTree.EdgeWithId): Promise<Tauri.Broadcast> {
  //     const status = await EdgeRepository.create(edge)
  //     if (status.kind === 'success') this.edges = await EdgeRepository.findAll()

  //     return status
  //   },
  //   async updateEdge(edge: FocusTree.EdgeWithId): Promise<Tauri.Broadcast> {
  //     const status = await EdgeRepository.update(edge.id, edge)
  //     if (status.kind === 'success') this.edges = await EdgeRepository.findAll()

  //     return status
  //   },
  //   async removeEdge(edge: FocusTree.EdgeWithId): Promise<Tauri.Broadcast> {
  //     const status = await EdgeRepository.remove(edge.id)
  //     if (status.kind === 'success') this.edges = await EdgeRepository.findAll()

  //     return status
  //   },
  //   async purgeEdges(): Promise<Tauri.Broadcast> {
  //     const status = await EdgeRepository.purge()
  //     if (status.kind === 'success') this.edges = await EdgeRepository.findAll()

  //     return status
  //   },
  //   async refresh() {
  //     try {
  //       this.nodes = await this.findAllNodes()
  //       this.edges = await this.findAllEdges()
  //     } catch (e) {
  //       console.error('Failed to refresh nodes and edges', e)
  //     }
  //   },

  //   async saveNodes(nodes: FocusTree.NodeWithId[]): Promise<Tauri.Broadcast[]> {
  //     const promises = nodes.map(async (node) => {
  //       const eNodes = await NodeRepository.findById(node.id)
        
  //       if (eNodes) return NodeRepository.update(node.id, node)
  //       else return NodeRepository.create(node)
  //     })
  //     return await Promise.all(promises)
  //   },

  //   async saveEdges(edges: FocusTree.EdgeWithId[]): Promise<Tauri.Broadcast[]> {
  //     const promises = edges.map(async (edge) => {
  //       const eNodes = await EdgeRepository.findById(edge.id)
        
  //       if (eNodes) return EdgeRepository.update(edge.id, edge)
  //       else return EdgeRepository.create(edge)
  //     })
  //     return await Promise.all(promises)
  //   },
  // }
})

export default useNodeStore