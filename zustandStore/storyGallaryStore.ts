import { PAGINATION } from "@faris/server/module/common/common.schema"
import { type TGetMiniUser } from "@faris/server/module/profile/profile.handler"
import { type TGetOneStory, type TGetListStory } from "@faris/server/module/story/story.handler"
import { create } from "zustand"


export type StoryGallaryStore = {
    storyList: TGetListStory,
    show: boolean,
    currentProfileIndex: number,
    totalProfiles: number,
    range: number,
    currentPage: number,
    totalPages: number,
    currentStoryIndex: number,
    totalStories: number,
    setData: (data: TGetListStory | [], page: number, type?: string) => void
    loadData: (data: TGetListStory | [], page: number, type?: string) => void
    setShow: (show: boolean) => void
    nextPage: () => void
    nextProfile: () => void
    previousProfile: () => void
    nextStory: () => void
    previousStory: () => void
    getCurrentProfile: () => TGetListStory[0] | undefined
    getNextProfile: () => TGetListStory[0] | undefined
    getPreviousProfile: () => TGetListStory[0] | undefined
    getCurrentStory: () => TGetListStory[0]['stories'][0] | undefined
    hasNextProfile: () => boolean
    hasPreviousProfile: () => boolean
    setCurrentProfile: (index: number) => void
    storyLikeProcedure: (profileId: string, storyId: string, user: TGetMiniUser, isLike: boolean) => void
    loadLikeList: (profileId: string, storyId: string, likeList: TGetMiniUser[], hasMore: boolean) => void
    deleteStory: (storyId: string) => void
    addStory:(profileId:string,newStory:TGetOneStory)=>void
}

export const useStoryGallary = create<StoryGallaryStore>((set, get) => ({
    storyList: [],
    show: false,
    currentProfileIndex: 0,
    totalProfiles: 0,
    range: PAGINATION.STORY,
    currentPage: 0,
    totalPages: 0,
    currentStoryIndex: 0,
    totalStories: 0,
    setShow(show) {
        if (show) {
            set({ show })
        } else {
            set({ show, currentProfileIndex: 0, currentStoryIndex: 0, totalProfiles: 0, totalStories: 0, currentPage: 0, totalPages: 0, storyList: [] })
        }
    },
    nextPage() {
        set(state => {
            if (state.currentPage + 1 < state.totalPages) {
                return { ...state, currentPage: state.currentPage + 1 }
            }
            return state
        })
    },
    nextProfile() {
        if (get().totalProfiles > get().currentProfileIndex + 1) {
            set(state => ({
                ...state,
                currentProfileIndex: state.currentProfileIndex + 1,
                currentStoryIndex: 0, // Reset the currentStoryIndex when changing profiles
                totalStories: state.storyList[state.currentProfileIndex + 1]?.stories.length ?? 0
            }));
        }
    },
    previousProfile() {
        if (get().currentProfileIndex > 0) {
            set(state => ({
                ...state,
                currentProfileIndex: state.currentProfileIndex - 1,
                currentStoryIndex: 0,
                totalStories: state.storyList[state.currentProfileIndex - 1]?.stories.length ?? 0
            }))
        }
    },
    nextStory() {
        if (get().totalStories > get().currentStoryIndex + 1) {
            set(state => ({ ...state, currentStoryIndex: state.currentStoryIndex + 1 }))
        } else {
            get().nextProfile()
        }
    },
    previousStory() {
        if (get().currentStoryIndex > 0) {
            set(state => ({ ...state, currentStoryIndex: state.currentStoryIndex - 1 }))
        } else {
            get().previousProfile()
        }
    },
    setData: (data, pages) => {
        set(state => ({ ...state, storyList: data ?? [], pages, totalProfiles: data.length, currentPage: 0, totalStories: data.at(0)?.stories.length }))
    },
    loadData: (data, pages) => {
        set(state => ({ ...state, storyList: [...state.storyList ?? [], ...data ?? []], totalProfiles: state.totalProfiles + data.length, pages }))
    },
    getCurrentProfile() {
        return get().storyList.at(get().currentProfileIndex)
    },
    getNextProfile() {
        if (get().currentProfileIndex + 1 < get().totalProfiles) {
            return get().storyList.at(get().currentProfileIndex + 1)
        }
        return undefined
    },
    getPreviousProfile() {
        if (get().currentProfileIndex > 0) {
            return get().storyList.at(get().currentProfileIndex - 1)
        }
        return undefined
    },
    hasNextProfile() {
        return get().currentProfileIndex + 1 < get().totalProfiles
    },
    hasPreviousProfile() {
        return get().currentProfileIndex > 0
    },
    getCurrentStory() {
        return get().storyList[get().currentProfileIndex]?.stories[get().currentStoryIndex]
    },
    setCurrentProfile(index) {
        if (get().totalProfiles > index) {
            set({ currentProfileIndex: index })
        }
    },
    storyLikeProcedure(profileId, storyId, user, isLike) {
        set((state) => {
            const updatedStoryList = state.storyList.map((profile) => {
                if (profile.ownerId === profileId) {
                    const updatedStories = profile.stories.map((story) => {
                        if (story.id === storyId) {
                            return { ...story, isLiked: isLike, likeList: isLike ? [...story.likeList, user] : [...story.likeList.filter(liker => liker.id !== user.id)] };
                        }
                        return story;
                    });
                    return { ...profile, stories: updatedStories };
                }
                return profile;
            });
            return { ...state, storyList: updatedStoryList };
        });
    },
    loadLikeList(profileId, storyId, likeList, hasMore) {
        set((state) => {
            const updatedStoryList = state.storyList.map((profile) => {
                if (profile.ownerId === profileId) {
                    const updatedStories = profile.stories.map((story) => {
                        if (story.id === storyId) {
                            return { ...story, likeList: [...story.likeList, ...likeList], hasMore };
                        }
                        return story;
                    });
                    return { ...profile, stories: updatedStories };
                }
                return profile;
            });
            return { ...state, storyList: updatedStoryList };
        });
    },
    deleteStory(storyId) {
        set((state) => {
            const updatedStoryList = state.storyList.map((profile) => {
                return { ...profile, stories: profile.stories.filter(story => story.id != storyId) }
            });
            return { ...state, storyList: updatedStoryList };
        })
    },
    addStory(profileId, newStory) {
        set((state) => {
          const updatedStoryList = state.storyList.map((profile) => {
            if (profile.ownerId === profileId) {
              return { ...profile, stories: [newStory.newStory, ...profile.stories] };
            }
            return profile;
          });
          return { ...state, storyList: updatedStoryList };
        });
      }
      
}))
