import { defineStore } from 'pinia'
import { NodeRepository, ConnectionRepository } from '@/database/node'
import type { Node, Edge } from '@vue-flow/core'


const useNodeStore = defineStore({
  id: 'nodes',
  state: () => ({
    // return {
      nodes: [] as Node[], //FocusTree.NodeWithId[],
      edges: [] as Edge[] //FocusTree.EdgeWithId[]
    // }
  }),
  getters: {
    getId(): number {
      const sNodes = localStorage.getItem('nodes')
      if (sNodes) return JSON.parse(sNodes).length
      return 0
    },
  },
  actions: {
    fetch() {
      const sNodes = localStorage.getItem('nodes')
      const sEdges = localStorage.getItem('edges')
      if (sNodes) {
        // const parsedNodes = JSON.parse(sNodes)
        // this.nodes = parsedNodes.map((node: any) => ({
        //   ...node,
        //   data: node.data || { label: '' },
        //   position: node.position || { x: 0, y: 0 }
        // }))
        this.nodes = JSON.parse(sNodes)
      }
      if (sEdges) this.edges = JSON.parse(sEdges)
    },
    save() {
      localStorage.setItem('nodes', JSON.stringify(this.nodes))
      localStorage.setItem('edges', JSON.stringify(this.edges))
    },
  },
  // actions: {
  //   // nodes
  //   async findAll(): Promise<{
  //     nodes: FocusTree.NodeWithId[], 
  //     connections: FocusTree.ConnectionWithId[] 
  //   }> {
  //     this.nodes = await NodeRepository.findAll()
  //     this.connections = await ConnectionRepository.findAll()
  //     return { nodes: this.nodes, connections: this.connections }
  //   },
  //   async findOne(id: string): Promise<FocusTree.Node> {
  //     return NodeRepository.findById(id)
  //   },
  //   async importAll(nodes: FocusTree.NodeWithId[]) {
  //     const promises = nodes.map((e) => NodeRepository.create(e))
  //     return await Promise.all(promises)
  //   },
  //   async create(node: FocusTree.NodeWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.create(node)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async update(node: FocusTree.NodeWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.update(node.id, focus)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async remove(node: FocusTree.FocusWithId): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.remove(node.id)
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   async purge(): Promise<Tauri.Broadcast> {
  //     const status = await NodeRepository.purge()
  //     if (status.kind === 'success') this.nodes = await NodeRepository.findAll()

  //     return status
  //   },
  //   // connections
  //   async findOneConnection(id: string): Promise<FocusTree.Connection> {
  //     return ConnectionRepository.findById(id)
  //   },
  //   async getConnectionsBySource(sourceId: string): Promise<FocusTree.Connection> {
  //     return ConnectionRepository.findBySource(sourceId)
  //   },
  //   async getConnectionsByTarget(targetId: string): Promise<FocusTree.Connection> {
  //     return ConnectionRepository.findByTarget(targetId)
  //   },
  //   async importAllConnections(connections: FocusTree.ConnectionWithId[]) {
  //     const promises = connections.map((e) => ConnectionRepository.create(e))
  //     return await Promise.all(promises)
  //   },
  //   async createConnection(node: FocusTree.ConnectionWithId): Promise<Tauri.Broadcast> {
  //     const status = await ConnectionRepository.create(node)
  //     if (status.kind === 'success') this.connections = await ConnectionRepository.findAll()

  //     return status
  //   },
  //   async updateConnection(connection: FocusTree.ConnectionWithId): Promise<Tauri.Broadcast> {
  //     const status = await ConnectionRepository.update(connection.id, focus)
  //     if (status.kind === 'success') this.connetions = await ConnectionRepository.findAll()

  //     return status
  //   },
  //   async removeConnection(connection: FocusTree.ConnectionWithId): Promise<Tauri.Broadcast> {
  //     const status = await ConnectionRepository.remove(connection.id)
  //     if (status.kind === 'success') this.connetions = await ConnectionRepository.findAll()

  //     return status
  //   },
  //   async purgeConnections(): Promise<Tauri.Broadcast> {
  //     const status = await ConnectionRepository.purge()
  //     if (status.kind === 'success') this.connetions = await ConnectionRepository.findAll()

  //     return status
  //   },
  //   //
  //   async refresh() {
  //     try {
  //       const { nodes, connections} = await this.findAll()
  //       this.nodes = nodes 
  //       this.connections = connections
  //     } catch (e) {
  //       console.error('Failed to refresh nodes', e)
  //     }
  //   }
  // }
})

export default useNodeStore