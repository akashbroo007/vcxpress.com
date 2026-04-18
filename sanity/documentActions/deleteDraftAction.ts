/* eslint-disable react-hooks/rules-of-hooks */
import {TrashIcon} from '@sanity/icons'
import {useState, useCallback} from 'react'
import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent} from 'sanity'

// Sanity DocumentActionComponents are designed to use React hooks
export const deleteDraftAction: DocumentActionComponent = (props) => {
  const {draft, type, id} = props

  // Call hooks unconditionally at the top level (React rules of hooks)
  const {delete: deleteOperation} = useDocumentOperation(id, type)
  const [isDeleting, setIsDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // All useCallback hooks must be called before any conditional returns
  const handleDelete = useCallback(() => {
    setIsDeleting(true)
    deleteOperation.execute()
    setIsDeleting(false)
    setDialogOpen(false)
  }, [deleteOperation])

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false)
  }, [])

  // Determine visibility conditions
  const isArticle = type === 'article'
  // Check if this is a draft document (either draft version exists with draft status, or no published version yet)
  const hasDraftVersion = draft?._id !== undefined
  const isDraftStatus = draft?.status === 'draft'
  const shouldShow = isArticle && hasDraftVersion && isDraftStatus

  // Return null if shouldn't show, but AFTER all hooks are called
  if (!shouldShow) return null

  if (dialogOpen) {
    return {
      label: 'Delete Draft',
      icon: TrashIcon,
      tone: 'critical',
      onHandle: handleDelete,
      title: 'Delete Draft Article?',
      dialog: {
        type: 'confirm',
        message: 'Are you sure you want to delete this draft article? This action cannot be undone.',
        onConfirm: handleDelete,
        onCancel: handleCloseDialog,
      },
    }
  }

  return {
    label: isDeleting ? 'Deleting...' : 'Delete Draft',
    icon: TrashIcon,
    tone: 'critical',
    disabled: isDeleting || Boolean(deleteOperation.disabled),
    onHandle: handleOpenDialog,
  }
}
