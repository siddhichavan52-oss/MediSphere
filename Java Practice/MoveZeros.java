class Solution {
    public void moveZeroes(int[] nums) 
    {
        int j=-1;
       for(int i=0;i<nums.length;i++)
       {
            if(nums[i]==0)
            {
                j=i;
                break;
            }
       }
       if(j==-1)
       {
        return;
       }
       for(int i=j+1;i<nums.length;i++)
       {
            if(nums[i]!=0)
            {
                int temp=nums[i];
                nums[i]=nums[j];
                nums[j]=temp;
                j++;
            }
       }
    }
}
class MoveZeros
{
    public static void main(String[] args) 
    {
        Solution obj1=new Solution();
        int[] nums={0,1,0,3,12};
        obj1.moveZeroes(nums);
        for(int i=0;i<nums.length;i++)
        {
            System.out.print(nums[i]+" ");
        }
    }
}